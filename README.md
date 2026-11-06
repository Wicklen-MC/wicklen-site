# Wicklen website

The standalone player website for **Wicklen** and **Wicklen: Chronicles**.
Static HTML, CSS, JavaScript, local icons and genuine native game screenshots.
No application server, Node.js runtime, package installation or external CDN is
needed to serve the site.

## Preview and build

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The three pages are `index.html`, `mods.html`
and `chronicles.html`; they also work when opened directly from disk.

Build the deployable directory with Python 3.11 or later:

```sh
python3 scripts/build.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

The build checks local assets, IDs and page anchors, then copies an explicit
public allowlist into `dist/` and writes its SHA-256 manifest. It excludes
repository documentation, CI, Python tools, provenance records and private files.
The `Check site` workflow validates changes; it does not deploy them.

## Pages and content

- `index.html`: gameplay directions, introduction to Chronicles and installation.
- `mods.html`: searchable mandatory pack catalog, filters and mod details.
- `chronicles.html`: the current mod's player guide, settings and screenshot gallery.
- `site.css` / `site.js`: shared styling and catalog behavior.
- `chronicles.css` / `chronicles.js`: the mod page and keyboard-accessible gallery.
- `experiences.js`: gameplay examples for the landing page.
- `data.js`: a self-contained snapshot of **pack 0.4.2**, recovered from
  `wicklen-server/releases/0.4.2/pack.lock.json`: **177 distinct mandatory mods**,
  including **165 server / 121 client JARs**. It records exact filenames,
  versions, install sides, SHA-512 hashes and upstream version/source identities.
  Optional preview additions are excluded. `catalogSource` pins the source lock's
  path and SHA-256; `manifestMods` contains the published 121-mod client inventory.
  Download metadata, checksums and instructions describe the same public release.
- `chronicles-release.js`: public filenames, URLs, sizes and checksums for 0.4.2.
- `deployment.js`: the public game address, `play.wicklen.link`, without credentials.
- `images/chronicles`: native client screenshots, capture provenance and source hashes.

The standalone checkout does not require the modpack or mod source repositories.
Update public catalog/release metadata from a reviewed pack release; do not copy
server configuration, player data or API keys into this repository. Preserve
existing descriptions, categories and local icons when an upstream project ID is
unchanged. New entries without a local icon use the catalog's built-in placeholder;
local custom mods link to their source repository instead of a fabricated Modrinth
page. A future catalog refresh must compare both client/server membership and
artifact hashes against its release lock, not infer production contents from a
mutable preview profile.

## Hosting and downloads

The intended public website domain is `wicklen.link`. Archive links are prepared
for `https://downloads.wicklen.link/releases/0.4.2/`, including the full client,
the patch from 0.4.1, instructions, manifest and checksums. These are the five
published files listed by `data.js`; no optional performance/graphics archive is
advertised by this catalog. ZIP files belong on the game VPS, outside this
repository and the site's `dist/`.

DNS, certificates, archive upload and hosting are configured separately in the
infrastructure repository. The catalog refresh itself does not deploy or certify
that a public endpoint is reachable. Deploy only `dist/` through the existing
shared Caddy setup. Keep absolute download URLs in HTML, `data.js` and
`chronicles-release.js` aligned; static links must also work with JavaScript
disabled. The gallery accepts only the configured HTTPS download origin for
release link enhancement.

Host configuration and rollout belong in
[wicklen-deployments](https://github.com/redz-projects/wicklen-deployments).
The pack and its technical documents live in
[wicklen-server](https://github.com/Wicklen-MC/wicklen-server);
the mod source lives in
[wicklen-chronicles](https://github.com/Wicklen-MC/wicklen-chronicles).

## Origin

Extracted from `Wicklen-MC/wicklen-server` revision
`eb16e4b` (`website/`) on 2026-11-06. The parent repository keeps that history.
Archived design templates, server documentation, local deployment overrides and
downloaded archives were intentionally excluded from this standalone source.
Screenshot PNGs were copied without image editing; their original capture records
remain under `images/chronicles/`.
