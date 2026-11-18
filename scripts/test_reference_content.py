import json
from pathlib import Path
import unittest
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent


def data(name):
    source = (ROOT / name).read_text()
    return json.loads(source[source.index('{'):].strip().removesuffix(';'))


class Navigation(HTMLParser):
    def __init__(self):
        super().__init__(); self.primary = False; self.links = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'nav':
            self.primary = values.get('aria-label') == 'Разделы сайта'
        if tag == 'a' and self.primary:
            self.links.append(values.get('href'))

    def handle_endtag(self, tag):
        if tag == 'nav':
            self.primary = False


class ReferenceContentTests(unittest.TestCase):
    def test_download_links_do_not_use_private_release_assets(self):
        releases = data('updates-data.js')['releases']
        self.assertEqual(len(releases), len({item['id'] for item in releases}))
        for release in releases:
            for item in release['files'] + release.get('primary', []) + release.get('changes', []):
                self.assertTrue(item['href'].startswith('https://'))
                self.assertNotIn('github.com/Wicklen-MC/wicklen-server/releases/', item['href'])
        self.assertTrue(any(item['id'] == 'compat-0-1-2' for item in releases))

    def test_current_server_download_and_new_release_are_distinguished(self):
        updates = data('updates-data.js')
        self.assertEqual(data('data.js')['version'], updates['liveVersion'])
        self.assertEqual(data('chronicles-release.js')['version'], updates['liveVersion'])
        self.assertEqual(data('handbook-data.js')['version'], updates['latestVersion'])

    def test_compat_is_a_guide_and_not_a_primary_navigation_link(self):
        for name in ['index.html', 'mods.html', 'chronicles.html', 'compat.html', 'guides.html', 'updates.html']:
            nav = Navigation(); nav.feed((ROOT / name).read_text())
            self.assertIn('mods.html', nav.links, name)
            self.assertNotIn('handbook.html', nav.links, name)
            self.assertIn('updates.html', nav.links, name)
            self.assertNotIn('compat.html', nav.links, name)
        self.assertIn('id="compat"', (ROOT / 'guides.html').read_text())
        self.assertEqual('guides.html#compat', data('handbook-data.js')['guideLinks']['wicklen-pack-compat'])


if __name__ == '__main__':
    unittest.main()
