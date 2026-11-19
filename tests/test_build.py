"""Build contracts: source isolation, deterministic output and failed-build recovery."""

import hashlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from tests.support import rendered
from wicklen_site import build, layout
from wicklen_site.paths import PUBLIC_FILES, ROOT, source_files


class BuildTests(unittest.TestCase):
    def test_one_command_renders_without_modifying_sources(self):
        files = [
            p
            for folder in ("src", "content", "templates", "wicklen_site")
            for p in (ROOT / folder).rglob("*")
            if p.is_file() and "__pycache__" not in p.parts
        ]
        before = {p: hashlib.sha256(p.read_bytes()).digest() for p in files}
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "dist"
            build.build(output)
            first = (output / "SHA256SUMS.txt").read_bytes()
            build.build(output)
            self.assertEqual(first, (output / "SHA256SUMS.txt").read_bytes())
            self.assertTrue((output / "mod-guide.html").is_file())
            self.assertTrue((output / "mod-guide-index.js").is_file())
            for name in ("mod-guides.json", "guide-recipes.json"):
                self.assertEqual(
                    (ROOT / "content" / name).read_bytes(), (output / name).read_bytes()
                )
            self.assertFalse((output / "content").exists())
            self.assertFalse((output / "templates").exists())
        self.assertEqual(
            before, {p: hashlib.sha256(p.read_bytes()).digest() for p in files}
        )

    def test_failed_copy_keeps_previous_successful_dist(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "dist"
            output.mkdir()
            (output / "index.html").write_text("previous successful build")
            with (
                patch.object(
                    build.shutil, "copyfile", side_effect=OSError("disk full")
                ),
                self.assertRaisesRegex(OSError, "disk full"),
            ):
                build.write_dist(
                    {"favicon.svg": ROOT / "public/favicon.svg"}, {}, output
                )
            self.assertEqual(
                "previous successful build", (output / "index.html").read_text()
            )
            self.assertEqual(
                ["dist"], sorted(p.name for p in Path(directory).iterdir())
            )

    def test_failed_switch_restores_previous_dist(self):
        original = Path.rename

        def fail_switch(path, target):
            if path.name == "dist" and path.parent.name.startswith(".site-build-"):
                raise OSError("cannot switch")
            return original(path, target)

        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "dist"
            output.mkdir()
            (output / "index.html").write_text("previous")
            with (
                patch.object(Path, "rename", fail_switch),
                self.assertRaisesRegex(OSError, "cannot switch"),
            ):
                build.write_dist({}, {"index.html": "new"}, output)
            self.assertEqual("previous", (output / "index.html").read_text())

    def test_missing_assets_and_anchors_fail_before_output(self):
        for link, reason in (
            ("missing.css", "unpublished local target"),
            ("mods.html#missing", "missing anchor"),
            ("../outside.png", "escapes the site"),
        ):
            with self.subTest(link=link):
                outputs = dict(rendered())
                outputs["index.html"] += f'<a href="{link}">Broken</a>'
                with self.assertRaisesRegex(ValueError, reason):
                    build.validate(source_files(), outputs)

    def test_relative_links_are_normalized_and_fragments_decoded(self):
        outputs = dict(rendered())
        outputs["index.html"] += '<a href="./mods.html#mechanics%2Dtitle">Guides</a>'
        build.validate(source_files(), outputs)
        self.assertEqual(
            "images/screen.webp",
            build.local_target("nested/page.html", "../images/screen.webp"),
        )

    def test_public_collection_rejects_symlinked_media(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "public").mkdir()
            (root / "public/images").symlink_to(
                ROOT / "public/images", target_is_directory=True
            )
            with self.assertRaisesRegex(ValueError, "Symlinked public media directory"):
                source_files(root)

    def test_asset_hashes_include_generated_script_content(self):
        source = '<script src="data.js"></script>'
        first = layout.version_assets(source, {}, {"data.js": "one"})
        second = layout.version_assets(source, {}, {"data.js": "two"})
        self.assertNotEqual(first, second)
        self.assertEqual(first, layout.version_assets(first, {}, {"data.js": "one"}))

    def test_only_explicit_content_exports_are_public(self):
        self.assertIn("mod-guides.json", PUBLIC_FILES)
        self.assertIn("guide-recipes.json", PUBLIC_FILES)
        self.assertNotIn("catalog.json", PUBLIC_FILES)
        self.assertNotIn("content/catalog.json", PUBLIC_FILES)
        self.assertFalse(any("provenance" in name for name in source_files()))


if __name__ == "__main__":
    unittest.main()
