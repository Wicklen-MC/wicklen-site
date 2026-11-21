"""Guide image markup, captions and attribution."""

from html import escape


def render_figure(item, lead=False, compact=False):
    e = lambda value: escape(str(value), quote=True)
    label = (
        ("Схема Wicklen" if item["kind"] == "diagram" else "Снимок Wicklen")
        if item["origin"] == "wicklen"
        else ("Иллюстрация автора" if item["kind"] == "diagram" else "Снимок автора")
    )
    note = (
        f'<span class="guide-image-note">{e(item["note"])}</span>'
        if item.get("note")
        else ""
    )
    title = "" if compact else f"<strong>{e(item['alt'])}</strong> "
    return f'<figure class="guide-image{" guide-hero" if lead else ""}"><a href="{e(item["src"])}" class="guide-image-open" data-guide-image target="_blank" aria-label="Увеличить: {e(item["alt"])}"><img src="{e(item["src"])}" width="{item["width"]}" height="{item["height"]}" alt="{e(item["alt"])}" loading="lazy" decoding="async"><span class="guide-image-zoom" aria-hidden="true">Увеличить</span></a><figcaption>{title}{e(item["caption"])}<small>{label} · <a href="{e(item["sourceUrl"])}" target="_blank" rel="noopener">{e(item["credit"])}</a></small>{"" if compact else note}</figcaption></figure>'
