import hashlib
import json
import unittest
from pathlib import Path
from urllib.parse import urlsplit

from tests.support import CONTENT, PUBLIC, rendered, text
from tests.support import data as js_data
from wicklen_site import build
from wicklen_site.paths import source_files


class ModGuideTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((CONTENT / "mod-guides.json").read_text())
        self.catalog = js_data("data.js")

    def test_guides_match_the_published_catalog(self):
        self.assertEqual(self.data["packVersion"], self.catalog["version"])
        self.assertEqual(
            self.data["sourceLockSha256"],
            js_data("handbook-data.js")["sourceLockSha256"],
        )
        catalog = {m["id"]: m for m in self.catalog["mods"]}
        covered = []
        for topic in self.data["topics"]:
            self.assertEqual(topic["modIds"], [m["id"] for m in topic["members"]])
            for member in topic["members"]:
                expected = catalog[member["id"]]
                self.assertEqual(member["version"], expected["version"])
                self.assertEqual(member["side"], expected["side"])
                covered.append(member["id"])
        self.assertEqual(45, len(set(covered)))

    def test_short_cards_and_source_links_are_usable(self):
        topics = self.data["topics"]
        ids = {t["id"] for t in topics}
        self.assertEqual(24, len(topics))
        self.assertEqual(len(topics), len(ids))
        for topic in topics:
            with self.subTest(topic=topic["id"]):
                self.assertEqual(3, len(topic["short"]["steps"]))
                self.assertLessEqual(
                    len(json.dumps(topic["short"], ensure_ascii=False)), 600
                )
                self.assertGreaterEqual(len(topic["sections"]), 2)
                self.assertTrue(topic["faq"])
                self.assertTrue(topic["sources"])
                for source in topic["sources"]:
                    url = urlsplit(source["url"])
                    self.assertEqual("https", url.scheme)
                    self.assertTrue(url.netloc)
                self.assertTrue(set(topic["related"]) <= ids)
                self.assertNotIn(topic["id"], topic["related"])

    def test_full_site_guides_have_chapters_walkthroughs_and_valid_tables(self):
        for topic in self.data["topics"]:
            with self.subTest(topic=topic["id"]):
                self.assertTrue(topic.get("siteIntro"))
                ids = [s["id"] for s in topic["sections"]]
                self.assertEqual(len(ids), len(set(ids)))
                self.assertTrue(
                    any(
                        s.get("table") or s.get("recipes") or s.get("steps")
                        for s in topic["sections"]
                    )
                )
                used = []
                for section in topic["sections"]:
                    if table := section.get("table"):
                        self.assertGreaterEqual(len(table["headers"]), 2)
                        self.assertTrue(table["rows"])
                        for row in table["rows"]:
                            self.assertEqual(len(table["headers"]), len(row))
                    for index in section.get("images", []) + [
                        f["image"] for f in section.get("finds", []) if "image" in f
                    ]:
                        self.assertGreater(index, 0)
                        self.assertLess(index, len(topic["images"]))
                        used.append(index)
                self.assertEqual(len(used), len(set(used)))
                self.assertEqual(set(range(1, len(topic["images"]))), set(used))

    def test_every_guide_has_illustrations_with_local_files_and_credits(self):
        for topic in self.data["topics"]:
            with self.subTest(topic=topic["id"]):
                self.assertGreaterEqual(len(topic.get("images", [])), 2)
                for image in topic["images"]:
                    self.assertTrue(image["src"].startswith("images/"))
                    self.assertNotIn("..", Path(image["src"]).parts)
                    self.assertTrue((PUBLIC / image["src"]).is_file())
                    self.assertGreater(image["width"], 100)
                    self.assertGreater(
                        image["height"], 100 if image["kind"] == "screenshot" else 32
                    )
                    self.assertTrue(image["alt"])
                    self.assertTrue(image["caption"])
                    self.assertTrue(image["credit"])
                    self.assertIn(image["origin"], ["author", "wicklen"])
                    self.assertEqual("https", urlsplit(image["sourceUrl"]).scheme)

    def test_downloaded_and_native_images_match_their_provenance(self):
        folder = PUBLIC / "images/guides/mods"
        evidence = json.loads(
            (
                CONTENT / "provenance" / folder.relative_to(PUBLIC) / "provenance.json"
            ).read_text()
        )
        published = {row["publishedFile"]: row for row in evidence}
        files = {
            p.relative_to(PUBLIC).as_posix()
            for p in folder.iterdir()
            if p.suffix in {".png", ".webp", ".jpg"}
        }
        self.assertEqual(files, set(published))
        for file, row in published.items():
            self.assertEqual(
                hashlib.sha256((PUBLIC / file).read_bytes()).hexdigest(),
                row.get("publishedSha256", row.get("sha256")),
            )

    def test_rendered_guides_and_catalog_index_are_current(self):
        build.validate(source_files(), rendered())
        index = js_data("mod-guide-index.js")
        self.assertEqual(
            {t["id"] for t in self.data["topics"]}, {t["id"] for t in index["topics"]}
        )
        self.assertNotIn("journal-", text("mod-guide.html"))

    def test_recipe_sources_and_ingredient_assets_are_complete(self):
        data = json.loads((CONTENT / "guide-recipes.json").read_text())
        self.assertEqual(self.data["packVersion"], data["packVersion"])
        used = [
            id
            for t in self.data["topics"]
            for s in t["sections"]
            for id in s.get("recipes", [])
        ]
        self.assertEqual(set(data["recipes"]), set(used))
        self.assertEqual(len(used), len(set(used)))
        for recipe in data["recipes"].values():
            self.assertEqual(64, len(recipe["jarSha256"]))
            self.assertEqual(64, len(recipe["resourceSha256"]))
            self.assertTrue(recipe["resource"].startswith("data/"))
            raw = recipe["raw"]
            self.assertIn(
                raw["type"],
                [
                    "minecraft:crafting_shaped",
                    "minecraft:crafting_shapeless",
                    "minecraft:smelting",
                    "travelersbackpack:backpack_shaped",
                    "farmersdelight:cooking",
                ],
            )
            refs = (
                list(raw.get("key", {}).values())
                + raw.get("ingredients", [])
                + ([raw["ingredient"]] if "ingredient" in raw else [])
                + [raw["result"]["id"]]
            )
            for ref in refs:
                self.assertIn(ref, data["items"])
                self.assertTrue(data["items"][ref]["label"])
                if icon := data["items"][ref].get("icon"):
                    self.assertTrue((PUBLIC / icon).is_file())

    def test_recipe_icons_are_original_binary_assets(self):
        rows = json.loads(
            (CONTENT / "provenance/images/guides/items/provenance.json").read_text()
        )
        for row in rows:
            self.assertEqual(
                hashlib.sha256((PUBLIC / row["file"]).read_bytes()).hexdigest(),
                row["sha256"],
            )
            self.assertTrue(row["resource"].startswith("assets/"))
        icons = {row["file"] for row in rows}
        self.assertEqual(
            icons,
            {
                p.relative_to(PUBLIC).as_posix()
                for p in (PUBLIC / "images/guides/items").glob("*.png")
            },
        )

    def test_screenshot_precedes_intro_and_collapsed_contents(self):
        html = text("mod-guide.html")
        for topic in self.data["topics"]:
            article = html.split(f'<article id="guide-{topic["id"]}"', 1)[1].split(
                "</article>", 1
            )[0]
            self.assertLess(article.index("guide-hero"), article.index("guide-intro"))
            self.assertLess(article.index("guide-hero"), article.index("guide-toc"))
            self.assertNotIn('class="guide-toc" open', article)
        for topic in js_data("mod-guide-index.js")["topics"]:
            self.assertTrue((PUBLIC / topic["preview"]["src"]).is_file())

    def test_search_cards_show_appearance_place_and_acquisition(self):
        for topic in self.data["topics"]:
            for section in topic["sections"]:
                for card in section.get("finds", []):
                    with self.subTest(topic=topic["id"], item=card["name"]):
                        for field in ("name", "biomes", "where", "how"):
                            self.assertTrue(card[field])
                        self.assertTrue("image" in card or card.get("icon"))
                        if icon := card.get("icon"):
                            self.assertTrue((PUBLIC / icon).is_file())
                            self.assertGreater(card["width"], 0)
                            self.assertGreater(card["height"], 0)
        end = next(t for t in self.data["topics"] if t["id"] == "end-remastered")
        atlas = next(s for s in end["sections"] if s["id"] == "eye-atlas")
        self.assertEqual(16, len(atlas["finds"]))

    def test_gateway_guide_matches_restored_release_configuration(self):
        topic = next(t for t in self.data["topics"] if t["id"] == "gateways")
        settings = topic["packSettings"]
        self.assertEqual("CUSTOM", settings["portalContentMode"])
        for field in (
            "mobDropsEnabled",
            "automaticGatewaysEnabled",
            "chestDropsEnabled",
        ):
            self.assertIs(True, settings[field])
        self.assertEqual(
            {
                "wicklen_courtyard_v1",
                "wicklen_courtyard_empowered_v1",
                "runestone_gate",
                "necromancer_gate",
                "maelstrom_portal",
                "golden_rune_gate_overworld",
                "golden_rune_gate_nether",
                "golden_rune_gate_end",
            },
            set(settings["profiles"]),
        )
        self.assertEqual(
            {
                "wicklen_runestone_exploration",
                "golden_event_overworld",
                "golden_event_nether",
                "golden_event_end",
            },
            set(settings["automaticRules"]),
        )
        keys = next(s for s in topic["sections"] if s["id"] == "keys")["finds"]
        self.assertEqual(4, len(keys))
        for key in keys:
            self.assertEqual("Доступен в Wicklen 0.6.0", key["availability"])
        self.assertNotIn("не выпадают", topic["notice"]["title"])
        ward = next(s for s in topic["sections"] if s["id"] == "wards")
        self.assertEqual(["portal-ward-1"], ward["recipes"])
        recipe = json.loads((CONTENT / "guide-recipes.json").read_text())["recipes"][
            "portal-ward-1"
        ]["raw"]
        self.assertEqual(["ORO", "RAR", "ORO"], recipe["pattern"])
        self.assertEqual(
            {
                "A": "minecraft:amethyst_shard",
                "O": "minecraft:crying_obsidian",
                "R": "minecraft:redstone",
            },
            recipe["key"],
        )
        self.assertEqual("gateway_of_doom:portal_ward_1", recipe["result"]["id"])

    def test_search_icon_provenance(self):
        folder = PUBLIC / "images/guides/finders"
        rows = json.loads(
            (
                CONTENT / "provenance" / folder.relative_to(PUBLIC) / "provenance.json"
            ).read_text()
        )
        files = {p.relative_to(PUBLIC).as_posix() for p in folder.glob("*.png")}
        self.assertEqual(files, {row["file"] for row in rows})
        for row in rows:
            self.assertEqual(
                hashlib.sha256((PUBLIC / row["file"]).read_bytes()).hexdigest(),
                row["sha256"],
            )


if __name__ == "__main__":
    unittest.main()
