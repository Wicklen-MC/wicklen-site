# Wicklen website

The standalone player website for **Wicklen** and **Wicklen: Chronicles**.
Static HTML, CSS, JavaScript, local icons and genuine native game screenshots.
No application server, Node.js runtime, package installation or external CDN is
needed to serve the site.

## Preview and build

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The eight pages are `index.html`, `mods.html`,
`chronicles.html`, `compat.html`, `guides.html`, `handbook.html` `updates.html` and `mod-guide.html`; they also work when opened directly from disk.

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

- `index.html`: gameplay directions, Chronicles and installation of the live pack 0.5.0.
- `mods.html` / `handbook.js`: unified searchable catalog, capabilities and guide links.
  All 181 mandatory mods are described; libraries can be shown separately.
  `handbook.html` retains old bookmarks through a query/anchor-preserving redirect.
- `mod-guide.html`: 23 mechanic guides covering 44 installed mods; start, progression,
  troubleshooting, version-specific notes and primary sources.
  `mod-guides.json` owns the reviewed content. Run `python3 scripts/build_guides.py`
  after editing it; the build rejects stale HTML or catalog index.
  `mod-guide-index.js` connects the guides to catalog cards and Russian searches.
- `guides.html`: five detailed guides for Herbcraft Core, Alchemy, Cuisine,
  Arcana Novum and Compat. The four additions are installed on the server.
- `updates.html`: pack history 0.4.2–0.5.0, exact changed files and checksums.
- `chronicles.html`: Chronicles 0.4.4, settings and genuine native screenshot gallery.
- `compat.html`: Compat 0.1.2, REI fixes, Mochi protection and install instructions.
- `data.js`: live pack 0.5.0 inventory from its immutable release lock:
  181 unique mods, 169 server / 124 client JARs. Source IDs, membership, filenames
  and SHA-512 values match the lock. Existing descriptions and local icons persist.
- `handbook-data.js`: guide links and the source lock digest. Additions/overrides
  are empty because the new release has been adopted into the live catalog.
- `chronicles-release.js`: pack 0.5.0 downloads; mod version remains 0.4.4.
  The delta starts from pack 0.4.5. Exact sizes and SHA-256 come from publication.json.
- `deployment.js`: public game address without credentials.
- `images/guides/`, `images/chronicles/en`, `images/wanderer`, `videos/chronicles`:
  genuine native captures with their original provenance, separate from HTML concepts.
- `site.css`, `reference.css`, `site.js`, `experiences.js`: shared styling and content.

Primary navigation has one combined “Моды и гайды” destination. The game update
was separately authorized and verified through the restricted updater; website
publication does not itself update Minecraft.

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

The public website is live at [wicklen.link](https://wicklen.link). Archive files are served at `https://downloads.wicklen.link/releases/0.5.0/`, including the full client,
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

## Historical pack 0.4.5 metadata

Pack **0.4.5** includes Chronicles **0.4.4** and Compat **0.1.1**. The
0.4.4 → 0.4.5 client delta replaces exactly these two JARs and updates release
metadata. UPDATE.json lists Chronicles 0.4.3 and Compat 0.1.0 for removal. Other
mods, public configurations, the resource pack and private preferences are
retained. Public filenames, sizes and hashes come from the immutable publication
and release lock. Static HTML and both JavaScript metadata sources move together
after successful server adoption.

## Unified catalog and journal concepts

`mods.html` combines the catalog and player handbook. It defaults to the live pack
from `data.js`; selecting the published pack applies `handbook-data.js` overlays.
The download metadata stays aligned with the live server. Old `handbook.html`
bookmarks redirect to the new catalog, preserving queries and anchors.

Journal interface prototypes are local-only. They are preserved in the common
workspace under `workspace/prototypes/chronicles-journal/`, outside this public
repository and the build allowlist. Serve that directory on 127.0.0.1 for review.
Do not publish prototype pages or add them to site navigation without an explicit
request to publish them. Website changes and prototype review are separate tasks.
