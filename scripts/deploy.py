"""Upload one verified site release through the host's restricted SSH receiver."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time
import urllib.request

PUBLIC = 'https://wicklen.link/'


def verify_public(package):
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    last_error = None
    for attempt in range(5):
        try:
            with opener.open(PUBLIC + 'deployment.json', timeout=8) as response:
                if json.load(response)['revision'] != package['revision']:
                    raise ValueError('Public deployment revision differs')
            with opener.open(PUBLIC + 'SHA256SUMS.txt', timeout=8) as response:
                if hashlib.sha256(response.read()).hexdigest() != package['manifest_sha256']:
                    raise ValueError('Public checksum manifest differs')
            for name in package['files']:
                if '/' not in name and name.endswith('.html'):
                    with opener.open(PUBLIC + ('' if name == 'index.html' else name), timeout=8) as response:
                        if hashlib.sha256(response.read()).hexdigest() != package['files'][name]:
                            raise ValueError('Public page differs: ' + name)
            return
        except Exception as error:
            last_error = error
            if attempt < 4:
                time.sleep(2)
    raise RuntimeError('Public health check failed: ' + str(last_error))


def deploy(bundle):
    package = json.loads((bundle / 'package.json').read_text())
    revision = package['revision']
    if not re.fullmatch(r'[a-f0-9]{40}', revision):
        raise ValueError('Invalid revision')
    for name in ('archive_sha256', 'manifest_sha256'):
        if not re.fullmatch(r'[a-f0-9]{64}', package[name]):
            raise ValueError('Invalid package digest')
    archive = bundle / 'site.tar'
    if hashlib.sha256(archive.read_bytes()).hexdigest() != package['archive_sha256']:
        raise ValueError('Downloaded deployment artifact differs')
    host = os.environ['WICKLEN_SITE_DEPLOY_HOST']
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9.-]*', host):
        raise ValueError('Invalid deployment host')
    with tempfile.TemporaryDirectory(prefix='wicklen-site-ssh-') as directory:
        key = Path(directory) / 'key'
        known_hosts = Path(directory) / 'known_hosts'
        key.write_text(os.environ['WICKLEN_SITE_DEPLOY_KEY'] + '\n')
        known_hosts.write_text(os.environ['WICKLEN_SITE_KNOWN_HOSTS'] + '\n')
        key.chmod(0o600)
        known_hosts.chmod(0o600)
        connection = ['ssh', '-T', '-i', str(key), '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes',
                      '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=yes',
                      '-o', 'UserKnownHostsFile=' + str(known_hosts), 'wicklen-site-deploy@' + host]

        def remote(command, stdin=None):
            result = subprocess.run(connection + [command], stdin=stdin, capture_output=True, timeout=180)
            if result.returncode:
                raise RuntimeError('Restricted SSH deployment failed: ' + result.stderr.decode().strip())
            return json.loads(result.stdout)

        before = remote('status')
        previous = before.get('revision')
        try:
            with archive.open('rb') as stream:
                result = remote(f"deploy {revision} {package['archive_sha256']} {package['manifest_sha256']}", stream)
            if result.get('revision') != revision or result.get('manifest_sha256') != package['manifest_sha256']:
                raise ValueError('Receiver acknowledged another release')
            verify_public(package)
        except Exception:
            if previous and previous != revision and re.fullmatch(r'[a-f0-9]{40}', previous):
                try:
                    restored = remote(f'rollback {revision} {previous}')
                    print('Previous site revision restored' if restored.get('revision') == previous
                          else 'Rollback skipped: the active deployment has changed')
                except Exception as error:
                    print('Rollback request: ' + str(error))
            raise
    print(f'Deployed {revision}: {PUBLIC}')
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with Path(summary).open('a') as stream:
            stream.write(f'Published [{revision[:12]}]({PUBLIC})\n\nPrevious: `{previous}`\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle', type=Path, required=True)
    deploy(parser.parse_args().bundle)
