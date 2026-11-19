import json
import hashlib
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

    def test_every_guide_has_illustrations_with_local_files_and_credits(self):
        for topic in self.data['topics']:
            with self.subTest(topic=topic['id']):
                self.assertGreaterEqual(len(topic.get('images',[])),2)
                for image in topic['images']:
                    self.assertTrue(image['src'].startswith('images/'))
                    self.assertNotIn('..',Path(image['src']).parts)
                    self.assertTrue((ROOT/image['src']).is_file())
                    self.assertGreater(image['width'],100)
                    self.assertGreater(image['height'],100 if image['kind']=='screenshot' else 32)
                    self.assertTrue(image['alt']);self.assertTrue(image['caption']);self.assertTrue(image['credit'])
                    self.assertIn(image['origin'],['author','wicklen'])
                    self.assertEqual('https',urlsplit(image['sourceUrl']).scheme)

    def test_downloaded_and_native_images_match_their_provenance(self):
        folder=ROOT/'images/guides/mods'
        evidence=json.loads((folder/'provenance.json').read_text())
        published={row['publishedFile']:row for row in evidence}
        files={p.relative_to(ROOT).as_posix() for p in folder.iterdir() if p.suffix in {'.png','.webp','.jpg'}}
        self.assertEqual(files,set(published))
        for file,row in published.items():
            self.assertEqual(hashlib.sha256((ROOT/file).read_bytes()).hexdigest(),row.get('publishedSha256',row.get('sha256')))

    def test_rendered_guides_and_catalog_index_are_current(self):
        check_generated()
        index=js_data('mod-guide-index.js')
        self.assertEqual({t['id'] for t in self.data['topics']},{t['id'] for t in index['topics']})
        self.assertNotIn('journal-',(ROOT/'mod-guide.html').read_text())

if __name__=='__main__':unittest.main()
