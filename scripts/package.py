"""Create a verified static-site archive and public deployment marker."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tarfile


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_manifest(path):
    files = {}
    for line in path.read_text().splitlines():
        match = re.fullmatch(r'([a-f0-9]{64})  ([A-Za-z0-9][A-Za-z0-9._/-]*)', line)
        if not match:
            raise ValueError('Invalid checksum manifest')
        sha, name = match.groups()
        parts = PurePosixPath(name).parts
        if any(part.startswith('.') for part in parts) or name in files or name == 'SHA256SUMS.txt':
            raise ValueError('Unsafe or duplicate manifest path')
        files[name] = sha
    if 'index.html' not in files:
        raise ValueError('Missing index.html')
    return files


def package(dist, revision, output):
    if not re.fullmatch(r'[a-f0-9]{40}', revision):
        raise ValueError('Expected a full Git commit')
    files = read_manifest(dist / 'SHA256SUMS.txt')
    actual = {p.relative_to(dist).as_posix() for p in dist.rglob('*') if p.is_file() or p.is_symlink()}
    if actual != set(files) | {'SHA256SUMS.txt'}:
        raise ValueError('Build contains files outside its manifest')
    if 'deployment.json' in files:
        raise ValueError('Package only a fresh dist build')
    for name, expected in files.items():
        path = dist / name
        if path.is_symlink() or not path.resolve().is_relative_to(dist.resolve()) or digest(path) != expected:
            raise ValueError('Build asset differs: ' + name)
    marker = dist / 'deployment.json'
    marker.write_text(json.dumps({'revision': revision}, sort_keys=True) + '\n')
    files['deployment.json'] = digest(marker)
    manifest = dist / 'SHA256SUMS.txt'
    manifest.write_text(''.join(f'{files[name]}  {name}\n' for name in sorted(files)))
    output.mkdir(parents=True, exist_ok=True)
    archive_path = output / 'site.tar'
    with tarfile.open(archive_path, 'w') as archive:
        for name in sorted(set(files) | {'SHA256SUMS.txt'}):
            source = dist / name
            info = archive.gettarinfo(str(source), arcname=name)
            info.uid = info.gid = 0
            info.uname = info.gname = ''
            info.mtime = 0
            info.mode = 0o644
            with source.open('rb') as stream:
                archive.addfile(info, stream)
    result = {'revision': revision, 'archive_sha256': digest(archive_path),
              'manifest_sha256': digest(manifest), 'files': files}
    (output / 'package.json').write_text(json.dumps(result, indent=2) + '\n')
    print(f'Packaged {len(files) + 1} public files for {revision}')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    package(args.dist, args.revision, args.output)
