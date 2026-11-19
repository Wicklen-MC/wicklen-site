"""Shared static shell and local-asset versioning; no runtime templating needed."""
from html import escape
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parent.parent
PAGES = ('index.html', 'mods.html', 'updates.html', 'chronicles.html', 'compat.html', 'guides.html', 'reimagined.html')
NAVIGATION = (('mods.html', 'Моды и гайды'), ('updates.html', 'Обновления'),
              ('chronicles.html', 'Наш мод'), ('index.html#download', 'Скачать сборку'))
GROUPS = {'mod-guide.html': 'mods.html', 'guides.html': 'mods.html', 'compat.html': 'mods.html',
          'reimagined.html': 'index.html#download'}


def template(name):
    return (ROOT / 'templates' / name).read_text().strip()


def header(page):
    links = []
    for href, label in NAVIGATION:
        current = 'page' if href == page else ('location' if GROUPS.get(page) == href else None)
        attrs = ' class="site-nav-download"' if href.endswith('#download') else ''
        if current:
            attrs += f' aria-current="{current}"'
        links.append(f'<a href="{escape(href)}"{attrs}>{escape(label)}</a>')
    return '<!-- site:header -->\n' + template('site-header.html').replace('{{links}}', ''.join(links)) + '\n<!-- /site:header -->'


def footer():
    return '<!-- site:footer -->\n' + template('site-footer.html') + '\n<!-- /site:footer -->'


def image_viewer():
    return '<!-- site:viewer -->\n' + template('image-viewer.html') + '\n<!-- /site:viewer -->'


def version_assets(html, outputs=None):
    outputs = outputs or {}

    def replace(match):
        name = match[2]
        content = outputs[name].encode() if name in outputs else (ROOT / name).read_bytes()
        digest = hashlib.sha256(content).hexdigest()[:12]
        return f'{match[1]}{name}?v={digest}"'
    return re.sub(r'((?:src|href)=")([a-z0-9-]+\.(?:css|js))(?:\?[^"\s]*)?"', replace, html)


def shared_assets(html):
    html = re.sub(r'<link[^>]+href="theme\.css(?:\?[^"]*)?"[^>]*>\s*', '', html)
    html = re.sub(r'<script[^>]+src="site-common\.js(?:\?[^"]*)?"[^>]*></script>\s*', '', html)
    styles = re.search(r'<link\b[^>]*rel="stylesheet"', html)
    position = styles.start() if styles else html.index('</head>')
    html = html[:position] + '<link rel="stylesheet" href="theme.css">\n' + html[position:]
    scripts = re.search(r'<script\b', html)
    position = scripts.start() if scripts else html.index('</head>')
    return html[:position] + '<script src="site-common.js" defer></script>\n' + html[position:]


def render_page(source, page):
    source, count = re.subn(r'<!-- site:header -->.*?<!-- /site:header -->', lambda _: header(page), source, flags=re.S)
    if count != 1:
        raise ValueError(f'{page}: expected one shared header')
    source, count = re.subn(r'<!-- site:footer -->.*?<!-- /site:footer -->', lambda _: footer(), source, flags=re.S)
    if count != 1:
        raise ValueError(f'{page}: expected one shared footer')
    source = re.sub(r'<!-- site:viewer -->.*?<!-- /site:viewer -->\s*', '', source, flags=re.S)
    source = source.replace('<!-- site:footer -->', image_viewer() + '\n<!-- site:footer -->', 1)
    return version_assets(shared_assets(source))


def render_pages():
    return {name: render_page((ROOT / name).read_text(), name) for name in PAGES}
