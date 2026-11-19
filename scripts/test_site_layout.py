"""Contract checks for the shared shell and its static asset dependencies."""
import hashlib
from html.parser import HTMLParser
import re
import unittest
from unittest.mock import patch

import site_layout as layout
import build_guides
import build


class Shell(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class SiteLayoutTests(unittest.TestCase):
    def test_pages_share_one_shell_and_working_skip_target(self):
        outputs = layout.render_pages()
        outputs.update(build_guides.render(build_guides.read_data()))
        for name, text in outputs.items():
            if not name.endswith('.html'):
                continue
            with self.subTest(page=name):
                tags = Shell(text).tags
                for class_name in ('site-header', 'site-footer', 'site-nav'):
                    self.assertEqual(sum(class_name in a.get('class', '').split() for _, a in tags), 1)
                self.assertEqual(sum(a.get('id') == 'main' for _, a in tags), 1)
                self.assertEqual(sum(a.get('id') == 'image-viewer' for _, a in tags), 1)
                self.assertIn(('a', {'class': 'skip-link', 'href': '#main'}), tags)
                self.assertLess(text.index('theme.css'), text.index('site-common.js'))
                self.assertEqual(text.count('src="site-common.js?'), 1)

    def test_rendering_is_idempotent(self):
        for name, source in layout.render_pages().items():
            with self.subTest(page=name):
                self.assertEqual(layout.render_page(source, name), source)

    def test_navigation_identifies_page_and_related_section(self):
        self.assertIn('href="updates.html" aria-current="page"', layout.header('updates.html'))
        self.assertIn('href="mods.html" aria-current="location"', layout.header('mod-guide.html'))
        self.assertNotIn('aria-current', layout.header('index.html'))

    def test_template_drift_fails_the_build(self):
        original = layout.template
        def changed(name):
            return original(name) + ('<p>New footer</p>' if name == 'site-footer.html' else '')
        with patch.object(layout, 'template', side_effect=changed):
            with self.assertRaisesRegex(ValueError, 'stale'):
                build_guides.check_generated()

    def test_shared_assets_are_public_and_versioned_by_content(self):
        for name in ('theme.css', 'site-common.js'):
            self.assertIn(name, build.PUBLIC_FILES)
        for name, text in layout.render_pages().items():
            with self.subTest(page=name):
                for asset, digest in re.findall(r'(?:href|src)="([a-z0-9-]+\.(?:css|js))\?v=([a-f0-9]+)"', text):
                    self.assertEqual(digest, hashlib.sha256((layout.ROOT / asset).read_bytes()).hexdigest()[:12])


if __name__ == '__main__':
    unittest.main()
