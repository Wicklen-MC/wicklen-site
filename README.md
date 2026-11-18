# Wicklen website

The standalone player website for **Wicklen** and **Wicklen: Chronicles**.
Static HTML, CSS, JavaScript, local icons and genuine native game screenshots.
No application server, Node.js runtime, package installation or external CDN is
needed to serve the site.

## Preview and build

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The seven pages are `index.html`, `mods.html`,
`chronicles.html`, `compat.html`, `guides.html`, `handbook.html` and `updates.html`; they also work when opened directly from disk.

Build the deployable directory with Python 3.11 or later:

```sh
python3 scripts/build.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

The build checks local assets, IDs and page anchors, then copies an explicit
public allowlist into `dist/` and writes its SHA-256 manifest. It excludes
repository documentation, CI, Python tools, provenance records and private files.
The `Website` workflow validates pull requests and automatically deploys checked
`main` commits to the VPS. Deployments use an immutable artifact, a dedicated
restricted SSH identity, atomic site switching and HTTPS checks with rollback.
Manual runs can select an earlier reviewed main-branch commit. Delayed automatic
runs skip deployment when main already contains a newer commit.

## Pages and content

- `updates.html` / `updates-data.js` / `updates.js`: pack history 0.4.2–0.5.0,
  component releases, exact changed JAR/resource/config/data-pack downloads,
  full/server/delta ZIPs and their pinned checksums. Pack 0.5.0 is published
  separately from live-server adoption; 0.4.5 remains the active download.
- `handbook.html` / `handbook-data.js` / `handbook.js`: searchable reference for
  all 181 mods of 0.5.0, including Compat as a player-facing entry. The existing
  0.4.5 catalog is retained and overlaid with the four additions and Compat 0.1.2.
  Query links use `?q=`; deep links open the selected mod. Shared `reference.css`
  also provides the visible six-link navigation, including mobile layouts.


- `guides.html` / `guides.css`: five player guides (Herbcraft Core,
  Alchemy, Cuisine, Arcana Novum and Wicklen Pack Compat) for Fabric 26.3. These mods were released in pack 0.5.0; the live server remains on 0.4.5. Exact version links, first recipes, local test boundaries
  and Arcana language limitations are stated explicitly; Compat 0.1.2 fixes the brewing-display gap.
  `images/guides/` contains genuine English native test captures; provenance JSON
  is excluded from the public build. The main catalog inventory remains unchanged.

- `index.html`: gameplay directions, introduction to Chronicles and installation.
- `mods.html`: searchable mandatory pack catalog, filters and mod details.
- `chronicles.html`: the current mod's player guide, settings and screenshot gallery,
  with a small block linking to the separate compatibility adapter.
- `compat.html` / `compat.css`: Wicklen Pack Compat, its published 0.1.2 download,
  installation sides and supported mods. REI/Farmer’s Delight fixes and shoulder-damage protection
  explain why the adapter is needed on both client and server.
  Compat is a guide section and handbook entry; the primary navigation links to Guides rather than the individual adapter.
- `site.css` / `site.js`: shared styling and catalog behavior.
- `chronicles.css` / `chronicles.js`: the mod page and keyboard-accessible gallery.
- `experiences.js`: gameplay examples for the landing page.
- `data.js`: a self-contained snapshot of **pack 0.4.5**, pinned to
  `wicklen-server/pack/releases/0.4.5/pack.lock.json`: **177 distinct mandatory mods**,
  including **165 server / 121 client JARs**. It records exact filenames,
  versions, install sides, SHA-512 hashes and upstream version/source identities.
  Optional preview additions are excluded. `catalogSource` pins the source lock's
  path and SHA-256; `manifestMods` contains the published 121-mod client inventory.
  Download metadata, checksums and instructions describe the same public release.
- `chronicles-release.js`: public filenames, URLs, sizes and checksums for pack 0.4.5; `chroniclesVersion` is 0.4.4 and `updateFrom` is 0.4.4.
- `deployment.js`: the public game address, `play.wicklen.link`, without credentials.
- `images/chronicles/en`: current native English-interface 0.4.3 screenshots, capture provenance and source hashes.
- `images/chronicles`: original Russian 0.4.2 captures retained for historical references.
- `images/wanderer` / `videos/chronicles`: the upcoming cloth-wanderer screenshots
  and 24-second native recording; [source provenance](images/wanderer/README.md).
- `spirit-media.js`: homepage SVG play/pause, visibility and reduced-motion controls.

## Spirit illustration and native footage

The homepage hero uses an inline SVG in `index.html#hero-spirit-art`: a cloth hood,
warm eyes, teal patches and two ribbons. CSS animates hovering, cloth, blinking and
small background sparks. It needs no video, canvas, renderer library or CDN.
The static SVG is already meaningful without JavaScript. Enhancement starts motion
only while visible, pauses it outside the viewport or in a hidden tab, provides a
manual pause, and respects `prefers-reduced-motion`. Data-saving mode starts static
until the visitor explicitly chooses animation.

`chronicles.html#spirit-preview` has a separate native video and four zoomable
screenshots of **development mod 0.4.3-SNAPSHOT**. The video has ordinary controls,
no autoplay and `preload="none"`; it also works without JavaScript. Existing
keyboard gallery navigation includes the new frames. The page announces the published
**Chronicles 0.4.4** release. Recommended live-server downloads use
**pack 0.4.5 / Chronicles 0.4.4 / Compat 0.1.1** after server adoption; the standalone release is linked separately.
Screenshot WebP conversion is lossless;
the original MP4 is preserved unchanged.

The public build checks video sources and posters and explicitly permits MP4/WebM
media under `videos/`. Provenance and repository documentation remain excluded.
Browser QA covers 1440, 390 and 320-pixel widths, SVG motion/pause/offscreen pause,
reduced-motion changes, native video playback, gallery keyboard controls and
JavaScript-disabled presentation. Local QA captures stay under ignored `preview/`.

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

The public website is live at [wicklen.link](https://wicklen.link). Archive files are served at `https://downloads.wicklen.link/releases/0.4.5/`, including the full client,
the patch from 0.4.4, instructions, manifest and checksums. These are the five
published files listed by `data.js`; no optional performance/graphics archive is
advertised by this catalog. ZIP files belong on the game VPS, outside this
repository and the site's `dist/`.

Production HTTPS was verified on 2026-11-06: public Let’s Encrypt certificates,
HTTP redirects, all three pages, five release files and full-ZIP byte-range
downloads. The first deployment used revision `92a3725`; the active revision is
now exposed by `deployment.json`. Certificates are managed by the existing shared Caddy. Host configuration is maintained separately
in the infrastructure repository. Deploy only `dist/`. Keep absolute download URLs in HTML, `data.js` and
`chronicles-release.js` aligned; static links must also work with JavaScript
disabled. The gallery accepts only the configured HTTPS download origin for
release link enhancement.

The workflow needs repository secrets `WICKLEN_SITE_DEPLOY_HOST`,
`WICKLEN_SITE_DEPLOY_KEY` and `WICKLEN_SITE_KNOWN_HOSTS`. They are provisioned
separately; no root key or game credentials enter this repository.
The host receiver and its bootstrap are maintained in
[wicklen-deployments](https://github.com/redz-projects/wicklen-deployments/blob/master/docs/SITE_DEPLOY.md).
`deployment.json` and the published checksum manifest identify the active site
revision. Site deployment does not publish pack archives or update Minecraft.
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

## Pack 0.4.5 metadata

Pack **0.4.5** includes Chronicles **0.4.4** and Compat **0.1.1**. The
0.4.4 → 0.4.5 client delta replaces exactly these two JARs and updates release
metadata. UPDATE.json lists Chronicles 0.4.3 and Compat 0.1.0 for removal. Other
mods, public configurations, the resource pack and private preferences are
retained. Public filenames, sizes and hashes come from the immutable publication
and release lock. Static HTML and both JavaScript metadata sources move together
after successful server adoption.
