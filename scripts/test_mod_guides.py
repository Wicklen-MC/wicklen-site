import json
from pathlib import Path
import unittest
from urllib.parse import urlsplit
from build_guides import check_generated

ROOT = Path(__file__).resolve().parent.parent

def js_data(name):
    value=(ROOT/name).read_text()
    return json.loads(value[value.index('{'):].strip().removesuffix(';'))

class ModGuideTests(unittest.TestCase):
    def setUp(self):
        self.data=json.loads((ROOT/'mod-guides.json').read_text())
        self.catalog=js_data('data.js')

    def test_guides_match_the_published_catalog(self):
        self.assertEqual(self.data['packVersion'],self.catalog['version'])
        self.assertEqual(self.data['sourceLockSha256'],js_data('handbook-data.js')['sourceLockSha256'])
        catalog={m['id']:m for m in self.catalog['mods']}
        covered=[]
        for topic in self.data['topics']:
            self.assertEqual(topic['modIds'],[m['id'] for m in topic['members']])
            for member in topic['members']:
                expected=catalog[member['id']]
                self.assertEqual(member['version'],expected['version'])
                self.assertEqual(member['side'],expected['side'])
                covered.append(member['id'])
        self.assertEqual(44,len(set(covered)))

    def test_short_cards_and_source_links_are_usable(self):
        topics=self.data['topics']; ids={t['id'] for t in topics}
        self.assertEqual(23,len(topics));self.assertEqual(len(topics),len(ids))
        for topic in topics:
            with self.subTest(topic=topic['id']):
                self.assertEqual(3,len(topic['short']['steps']))
                self.assertLessEqual(len(json.dumps(topic['short'],ensure_ascii=False)),600)
                self.assertGreaterEqual(len(topic['sections']),2)
                self.assertTrue(topic['faq'])
                self.assertTrue(topic['sources'])
                for source in topic['sources']:
                    url=urlsplit(source['url'])
                    self.assertEqual('https',url.scheme);self.assertTrue(url.netloc)
                self.assertTrue(set(topic['related'])<=ids)
                self.assertNotIn(topic['id'],topic['related'])

    def test_rendered_guides_and_catalog_index_are_current(self):
        check_generated()
        index=js_data('mod-guide-index.js')
        self.assertEqual({t['id'] for t in self.data['topics']},{t['id'] for t in index['topics']})
        self.assertNotIn('journal-',(ROOT/'mod-guide.html').read_text())

if __name__=='__main__':unittest.main()
