# Wicklen website

Static player website for Wicklen and Wicklen: Chronicles: mod catalog, guides,
native game screenshots, release history and downloads. Published at
[wicklen.link](https://wicklen.link).

## Build and preview

Python 3.11 or later, standard library only. No frontend packages or application
server are required.

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests -p 'test_*.py'
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8765/. Serve `dist/`, rather than the repository root.
The same build command renders guides, expands shared templates, generates public
JS data, versions CSS/JS URLs by content hash, checks local assets and anchors,
and writes `dist/SHA256SUMS.txt`. It never rewrites authoring files. A failed build
keeps the previous successful `dist/`.

## Repository layout

| Directory | Responsibility |
| --- | --- |
| `src/pages/` | Handwritten HTML pages; shared components use `{{site_header}}`, `{{site_viewer}}`, `{{site_footer}}`. |
| `src/styles/` | `theme.css` owns shared tokens/components; other styles belong to individual pages. |
| `src/scripts/` | Browser behavior. `site-common.js` owns shared gallery, section navigation, print and formatting helpers. |
| `content/` | JSON catalog, release metadata, guides, recipes, homepage descriptions and ZIP manifest. |
| `content/provenance/` | Original image records, checksums and credits; excluded from publication. |
| `templates/` | Shared header, footer and image viewer. |
| `public/` | Original images, icons, video, favicon and social preview images. |
| `wicklen_site/` | Python generators, asset registry, validation and output assembly. |
| `scripts/` | Build entry point, verified artifact packaging and restricted website deployment. |
| `tests/` | Content, rendering, deterministic build, failure recovery and packaging checks. |
| `dist/` | Ignored complete public build. |

`wicklen_site/paths.py` maps sources to public names. Existing URLs such as
`mods.html`, `site.css`, `data.js`, `images/...` stay stable. Adding a page, stylesheet
or script requires registering it explicitly. Media extensions are restricted;
JSON exports are explicit; templates, tools, provenance and local prototypes are
excluded from publication. Existing `mod-guides.json` and `guide-recipes.json`
exports retain their URLs and original bytes.

## Editing content

- `content/catalog.json`: published pack 0.7.0 (server installation in progress), 182 unique mods, 125 client / 170
  server JARs. Keep filenames, membership and hashes aligned with the immutable
  published release lock. Preserve descriptions and local icons.
- `content/handbook.json`: guide links and optional overlays for a different
  published release. The selector is hidden when only the live release exists.
- `content/updates.json` and `content/chronicles-release.json`: public release
  downloads. Pack 0.7.0 and Chronicles 0.4.4 are independent versions. Client 0.6.0
  requires the update patch; other versions should use the full client.
- `content/mod-guides.json`: 23 full guides covering 45 installed mods. `siteIntro`,
  `sections` and `faq` own the articles; separate `short` cards are exported for
  the Spirit prototype. Generated `mod-guide.html` and `mod-guide-index.js` exist
  only in `dist/`.
- `content/guide-recipes.json`: original recipe JSON, pinned JAR/resource hashes,
  ingredient labels and icons. Recipe cards are diagrams; screenshots remain
  genuine game captures. Image records and attribution live in
  `content/provenance/`, with public file names relative to `public/`.
- `content/experiences.json`: homepage gameplay descriptions.
- `content/deployment.json`: public game address, without credentials. The separate
  deployment marker `dist/deployment.json` is added by release packaging.
- `content/reimagined-download.json`: pinned optional Reimagined inputs and our
  preset. The browser verifies hashes and assembles the existing-profile ZIP.
  Original third-party files are fetched directly by the visitor. The new-profile
  `.mrpack` is linked from the public `reimagined-v1.0.0` GitHub release.

Prepare exact release metadata from the final immutable pack directory with the
command below. Publish the website only after publishing those files and adopting
the pack on the game server. The optional `--live` records that operator confirmation.

```sh
python3 scripts/sync-pack-release.py --release-dir /path/to/0.7.0 --date 2026-11-22 --live
```

 The script checks the release checksum list and updates
download sizes, hashes, catalog inventory and guide provenance.

After any content, template, style or script change, run the single build command.
The parent workspace's Spirit exporter reads `content/mod-guides.json` directly.
A standalone site checkout requires no parent pack or mod checkout.

## Publication and boundaries

The `Website` workflow tests the selected revision, builds it, checks all emitted
JavaScript and packages only manifest-listed public files. Pushes to `main`
automatically publish the verified artifact through the restricted website
receiver. HTTPS checks verify the revision, manifest and pages; a failed health
check restores the previous website revision. Old verified main revisions remain
available for rollback, including the earlier repository layout.

`deployment.json` and `SHA256SUMS.txt` identify the published website. Pack archives
are separate immutable files at `https://downloads.wicklen.link/releases/0.7.0/`.
Never put ZIPs, JARs, worlds, player data or private configuration in `public/`.
Do not fabricate download URLs or describe unreleased features as published.
Website publication does not update Minecraft or restart the game server.

CI uses `WICKLEN_SITE_DEPLOY_HOST`, `WICKLEN_SITE_DEPLOY_KEY` and
`WICKLEN_SITE_KNOWN_HOSTS`; never print or commit them. Host configuration belongs
to the separate [infrastructure repository](https://github.com/redz-projects/wicklen-deployments).
The [workspace](https://github.com/Wicklen-MC/wicklen-server) owns pack releases;
[Chronicles](https://github.com/Wicklen-MC/wicklen-chronicles) owns the mod.
Local prototypes belong in ignored workspace storage, outside this public build.
