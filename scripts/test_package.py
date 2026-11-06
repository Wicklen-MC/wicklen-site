import hashlib
import importlib.util
from pathlib import Path
import tarfile
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('site_package', Path(__file__).with_name('package.py'))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class PackageChecks(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.dist = self.root / 'dist'
        self.dist.mkdir()
        (self.dist / 'index.html').write_text('<h1>Wicklen</h1>')
        digest = hashlib.sha256((self.dist / 'index.html').read_bytes()).hexdigest()
        (self.dist / 'SHA256SUMS.txt').write_text(digest + '  index.html\n')
        self.revision = 'a' * 40

    def test_verified_package_includes_revision_and_only_manifest_files(self):
        metadata = MODULE.package(self.dist, self.revision, self.root / 'bundle')
        with tarfile.open(self.root / 'bundle/site.tar') as archive:
            self.assertEqual({'index.html', 'deployment.json', 'SHA256SUMS.txt'}, set(archive.getnames()))
            self.assertTrue(all(item.isfile() and item.mode == 0o644 for item in archive.getmembers()))
        self.assertEqual(self.revision, metadata['revision'])

    def test_rejects_files_added_after_the_public_build(self):
        (self.dist / 'private.env').write_text('not public')
        with self.assertRaisesRegex(ValueError, 'outside its manifest'):
            MODULE.package(self.dist, self.revision, self.root / 'bundle')

    def test_rejects_modified_asset(self):
        (self.dist / 'index.html').write_text('modified')
        with self.assertRaisesRegex(ValueError, 'asset differs'):
            MODULE.package(self.dist, self.revision, self.root / 'bundle')

    def test_rejects_path_traversal_manifest(self):
        (self.dist / 'SHA256SUMS.txt').write_text('0' * 64 + '  ../private\n')
        with self.assertRaises(ValueError):
            MODULE.package(self.dist, self.revision, self.root / 'bundle')


if __name__ == '__main__':
    unittest.main()
