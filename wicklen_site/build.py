"""Render, validate and assemble the public website in one deterministic build."""

import hashlib
import json
import posixpath
import shutil
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

from . import guides, layout
from .paths import CONTENT_SCRIPTS, PAGES, PUBLIC_FILES, ROOT, source_files


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
        for attribute in ("src", "href", "poster"):
            if values.get(attribute):
                self.links.append(values[attribute])


def render(sources, root=ROOT):
    generated = {}
    for name, (filename, variable) in CONTENT_SCRIPTS.items():
        data = json.loads((root / "content" / filename).read_text(encoding="utf-8"))
        generated[name] = (
            f"window.{variable} = "
            + json.dumps(data, ensure_ascii=False, indent=2)
            + ";\n"
        )
    generated.update(guides.render(guides.read_data(root), root))
    for name in PAGES:
        source = (root / "src/pages" / name).read_text(encoding="utf-8")
        generated[name] = layout.render_page(source, name, root)
    for name, text in generated.copy().items():
        if name.endswith(".html"):
            generated[name] = layout.version_assets(text, sources, generated)
    return generated


def local_target(page, link):
    parsed = urlsplit(link)
    if parsed.scheme or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return page
    joined = (
        path.lstrip("/")
        if path.startswith("/")
        else posixpath.join(posixpath.dirname(page), path)
    )
    target = posixpath.normpath(joined)
    if target == ".." or target.startswith("../"):
        raise ValueError(f"{page}: local target escapes the site: {link}")
    return target


def validate(sources, generated):
    files = set(sources) | set(generated)
    missing = set(PUBLIC_FILES) - files
    if missing:
        raise ValueError(f"Missing public outputs: {sorted(missing)}")
    pages = {}
    for name, text in generated.items():
        if name.endswith(".html"):
            page = Page()
            page.feed(text)
            pages[name] = page
    for name, page in pages.items():
        for link in page.links:
            target = local_target(name, link)
            if target is None:
                continue
            if target not in files:
                raise ValueError(f"{name}: unpublished local target {link}")
            fragment = unquote(urlsplit(link).fragment)
            if fragment and target in pages and fragment not in pages[target].ids:
                raise ValueError(f"{name}: missing anchor {link}")
    return pages


def write_dist(sources, generated, output):
    """Stage the complete build before replacing a previously successful output."""
    if output.is_symlink():
        raise ValueError("Refusing a symlinked output directory")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(
        prefix=".site-build-", dir=output.parent
    ) as temporary:
        stage = Path(temporary) / "dist"
        stage.mkdir()
        sums = []
        for name in sorted(set(sources) | set(generated)):
            destination = stage / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            if name in generated:
                destination.write_text(generated[name], encoding="utf-8")
            else:
                shutil.copyfile(sources[name], destination)
            digest = hashlib.sha256(destination.read_bytes()).hexdigest()
            sums.append(f"{digest}  {name}\n")
        (stage / "SHA256SUMS.txt").write_text("".join(sums), encoding="utf-8")
        previous = Path(temporary) / "previous"
        if output.exists():
            output.rename(previous)
        try:
            stage.rename(output)
        except OSError:
            if previous.exists():
                previous.rename(output)
            raise


def build(output=None):
    sources = source_files()
    generated = render(sources)
    pages = validate(sources, generated)
    destination = Path(output) if output is not None else ROOT / "dist"
    write_dist(sources, generated, destination)
    print(
        f"Validated {len(pages)} pages and built {len(sources) + len(generated)} static assets in {destination.name}/"
    )
    return generated
