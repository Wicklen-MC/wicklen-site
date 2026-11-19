"""Source locations and the explicit public output contract.

Source folders never determine public URLs: existing bookmarks and downloads
keep their names while authoring files stay outside the published directory.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = (
    "index.html",
    "mods.html",
    "updates.html",
    "chronicles.html",
    "compat.html",
    "guides.html",
    "reimagined.html",
    "handbook.html",
)
STYLES = (
    "theme.css",
    "site.css",
    "reference.css",
    "chronicles.css",
    "compat.css",
    "guides.css",
    "mod-guide.css",
    "reimagined.css",
)
SCRIPTS = (
    "site-common.js",
    "site.js",
    "handbook.js",
    "handbook-redirect.js",
    "updates.js",
    "chronicles.js",
    "mod-guide.js",
    "spirit-media.js",
    "reimagined-download.js",
)
CONTENT_SCRIPTS = {
    "data.js": ("catalog.json", "MODS"),
    "handbook-data.js": ("handbook.json", "WICKLEN_HANDBOOK"),
    "updates-data.js": ("updates.json", "WICKLEN_UPDATES"),
    "chronicles-release.js": ("chronicles-release.json", "WICKLEN_CHRONICLES_RELEASE"),
    "experiences.js": ("experiences.json", "EXPERIENCES"),
    "deployment.js": ("deployment.json", "WICKLEN_DEPLOYMENT"),
}
CONTENT_FILES = ("mod-guides.json", "guide-recipes.json", "reimagined-download.json")
STATIC_FILES = ("favicon.svg", "landscape.svg", "og-image.png", "og-image.svg")
MEDIA = {
    "images": {".png", ".webp", ".svg", ".jpg", ".jpeg"},
    "icons": {".png", ".webp", ".svg", ".jpg", ".jpeg"},
    "videos": {".mp4", ".webm", ".vtt"},
}
PUBLIC_FILES = (
    *PAGES,
    "mod-guide.html",
    *STYLES,
    *SCRIPTS,
    *CONTENT_SCRIPTS,
    "mod-guide-index.js",
    *CONTENT_FILES,
    *STATIC_FILES,
)


def source_files(root=ROOT):
    """Map public names to source files; generated files are added by build.render."""
    files = {name: root / "src/styles" / name for name in STYLES}
    files.update({name: root / "src/scripts" / name for name in SCRIPTS})
    files.update({name: root / "public" / name for name in STATIC_FILES})
    files.update({name: root / "content" / name for name in CONTENT_FILES})
    for folder, extensions in MEDIA.items():
        directory = root / "public" / folder
        if directory.is_symlink():
            raise ValueError(f"Symlinked public media directory: {folder}")
        for path in directory.rglob("*"):
            if path.is_symlink():
                raise ValueError(f"Symlinked public media: {path.relative_to(root)}")
            if path.is_file() and path.suffix.lower() in extensions:
                files[path.relative_to(root / "public").as_posix()] = path
    for name, path in files.items():
        if (
            not path.is_file()
            or path.is_symlink()
            or not path.resolve().is_relative_to(root.resolve())
        ):
            raise ValueError(f"Expected a regular source asset: {name}")
    return files
