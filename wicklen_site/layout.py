"""Render shared static components and version assets without editing sources."""

import hashlib
import re
from html import escape

from .paths import ROOT

NAVIGATION = (
    ("mods.html", "Моды и гайды"),
    ("updates.html", "Обновления"),
    ("chronicles.html", "Наш мод"),
    ("index.html#download", "Скачать сборку"),
)
GROUPS = {
    "mod-guide.html": "mods.html",
    "guides.html": "mods.html",
    "compat.html": "mods.html",
    "reimagined.html": "index.html#download",
}
ASSET_URL = re.compile(r'((?:src|href)=")([a-z0-9-]+\.(?:css|js))(?:\?[^"\s]*)?"')


def template(name, root=ROOT):
    return (root / "templates" / name).read_text(encoding="utf-8").strip()


def header(page, root=ROOT):
    links = []
    for href, label in NAVIGATION:
        current = (
            "page"
            if href == page
            else ("location" if GROUPS.get(page) == href else None)
        )
        attrs = ' class="site-nav-download"' if href.endswith("#download") else ""
        if current:
            attrs += f' aria-current="{current}"'
        links.append(f'<a href="{escape(href)}"{attrs}>{escape(label)}</a>')
    return (
        "<!-- site:header -->\n"
        + template("site-header.html", root).replace("{{links}}", "".join(links))
        + "\n<!-- /site:header -->"
    )


def footer(root=ROOT):
    return (
        "<!-- site:footer -->\n"
        + template("site-footer.html", root)
        + "\n<!-- /site:footer -->"
    )


def image_viewer(root=ROOT):
    return (
        "<!-- site:viewer -->\n"
        + template("image-viewer.html", root)
        + "\n<!-- /site:viewer -->"
    )


def render_page(source, page, root=ROOT):
    components = {
        "site_header": header(page, root),
        "site_footer": footer(root),
        "site_viewer": image_viewer(root),
    }
    if page == "handbook.html":
        return source
    for name, component in components.items():
        token = "{{" + name + "}}"
        if source.count(token) != 1:
            raise ValueError(f"{page}: expected one {token}")
        source = source.replace(token, component)
    return source


def version_assets(html, sources, generated):
    def replace(match):
        name = match[2]
        if name in generated:
            content = generated[name].encode("utf-8")
        elif name in sources:
            content = sources[name].read_bytes()
        else:
            raise ValueError(f"Unknown script or stylesheet: {name}")
        digest = hashlib.sha256(content).hexdigest()[:12]
        return f'{match[1]}{name}?v={digest}"'

    return ASSET_URL.sub(replace, html)
