# Cloth-wanderer media

The four WebP files are native Minecraft screenshots from development mod
**0.4.3-SNAPSHOT**, copied from `Wicklen-MC/wicklen-chronicles` revision
`a460aad04e36f10f903975efb6c02df11c3febf6`.

Source captures and records:
`docs/development/wanderer/{images,video,captures.json}` in that repository.

PNG-to-WebP conversion is lossless. Decoded RGBA bytes were compared for every
image; there is no retouching, cropping or generated replacement imagery. The
24-second native MP4 under `public/videos/chronicles/` is copied byte-for-byte. It shows
a controlled test scene, rotating the companion, switching to night and presenting
a manually supplied demonstration line through the actual speech protocol.

[provenance.json](provenance.json) records both source and published hashes.
This file and the JSON record are excluded from the public build.

The homepage uses a separate **code-native SVG illustration** inside
`src/pages/index.html#hero-spirit-art`. Its motion lives in `src/styles/site.css` and
`src/scripts/spirit-media.js`. It is intentionally an illustrated interpretation, not a video
or game screenshot. Generated concept sheets are not used as public game footage.

At capture time, the public download was pack **0.4.3** with Chronicles **0.4.2**,
and the cloth model was a development preview. Current download metadata lives
in `content/catalog.json` and `content/chronicles-release.json`.
