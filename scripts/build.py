#!/usr/bin/env python3
"""Validate the standalone static site and assemble an explicit public allowlist."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import shutil
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "dist"
PUBLIC_FILES = (
    "index.html", "mods.html", "chronicles.html", "site.css", "site.js",
    "experiences.js", "data.js", "chronicles.css", "chronicles.js",
    "chronicles-release.js", "deployment.js", "favicon.svg", "landscape.svg",
    "og-image.png", "og-image.svg",
)


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        identifier = values.get("id")
        if identifier:
            if identifier in self.ids:
                raise ValueError(f"Duplicate element ID: {identifier}")
            self.ids.add(identifier)
        for attribute in ("src", "href"):
            if values.get(attribute):
                self.links.append(values[attribute])


def main():
    files = {Path(name) for name in PUBLIC_FILES}
    for folder in ("images", "icons"):
        for path in (ROOT / folder).rglob("*"):
            if path.is_file() and path.suffix.lower() in {".png", ".webp", ".svg", ".jpg", ".jpeg"}:
                files.add(path.relative_to(ROOT))
    for path in files:
        source = ROOT / path
        if not source.is_file() or source.is_symlink():
            raise ValueError(f"Expected a regular public asset: {path}")

    pages = {}
    for path in files:
        if path.suffix == ".html":
            page = Page()
            page.feed((ROOT / path).read_text())
            pages[path] = page
    for path, page in pages.items():
        for link in page.links:
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc:
                continue
            target = path.parent / unquote(parsed.path) if parsed.path else path
            if target not in files:
                raise ValueError(f"{path}: unpublished local target {link}")
            if parsed.fragment and target in pages and parsed.fragment not in pages[target].ids:
                raise ValueError(f"{path}: missing anchor {link}")

    if OUTPUT.exists():
        if OUTPUT.is_symlink():
            raise ValueError("Refusing a symlinked dist directory")
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    sums = []
    for path in sorted(files):
        destination = OUTPUT / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / path, destination)
        digest = hashlib.sha256(destination.read_bytes()).hexdigest()
        sums.append(f"{digest}  {path.as_posix()}\n")
    (OUTPUT / "SHA256SUMS.txt").write_text("".join(sums))
    print(f"Validated {len(pages)} pages and published {len(files)} static assets to dist/")


if __name__ == "__main__":
    main()
