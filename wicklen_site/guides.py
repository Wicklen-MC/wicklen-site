"""Render full player manuals while preserving the separate compact Spirit cards."""

import json
from html import escape
from string import Template

from . import layout
from .media import render_figure as figure
from .paths import ROOT
from .recipes import render_recipes


def read_data(root=ROOT):
    return json.loads((root / "content/mod-guides.json").read_text(encoding="utf-8"))


def render(data, root=ROOT):
    recipe_data = json.loads(
        (root / "content/guide-recipes.json").read_text(encoding="utf-8")
    )
    e = lambda s: escape(str(s), quote=True)
    href = lambda t: f"mod-guide.html?topic={t['id']}#guide-{t['id']}"

    links = "".join(
        f'<a href="{href(t)}" data-guide-link="{e(t["id"])}" data-search="{e(t["title"] + " " + t["aliases"])}">{e(t["title"])}</a>'
        for t in data["topics"]
    )
    cards = ""
    for t in data["topics"]:
        image = t.get("images", [None])[0]
        preview = (
            f'<img class="guide-card-preview" src="{e(image["src"])}" width="{image["width"]}" height="{image["height"]}" loading="lazy" alt="">'
            if image
            else ""
        )
        cards += f'<a class="guide-card" href="{href(t)}">{preview}<small>{e(t["group"])}</small><h2>{e(t["title"])}</h2><p>{e(t["short"]["summary"])}</p></a>'

    def section_body(section, images):
        body = "".join(f"<p>{e(p)}</p>" for p in section["paragraphs"])
        for field, tag in [("steps", "ol"), ("bullets", "ul")]:
            if section.get(field):
                body += (
                    f'<{tag} class="guide-{field}">'
                    + "".join(f"<li>{e(s)}</li>" for s in section[field])
                    + f"</{tag}>"
                )
        if table := section.get("table"):
            headings = "".join(f'<th scope="col">{e(h)}</th>' for h in table["headers"])
            rows = "".join(
                "<tr>"
                + "".join(
                    f"<td>{'<code>' + e(cell) + '</code>' if cell.startswith('/') else e(cell)}</td>"
                    for cell in row
                )
                + "</tr>"
                for row in table["rows"]
            )
            body += f'<div class="guide-table-scroll" role="region" aria-label="{e(section["title"])}" tabindex="0"><table><thead><tr>{headings}</tr></thead><tbody>{rows}</tbody></table></div>'
        if section.get("recipes"):
            body += render_recipes(section["recipes"], recipe_data)
        if section.get("finds"):
            cards = []
            for find in section["finds"]:
                picture = (
                    figure(images[find["image"]], compact=True)
                    if "image" in find
                    else (
                        f'<div class="guide-find-icon"><img src="{e(find["icon"])}" width="{find["width"]}" height="{find["height"]}" alt="{e(find["name"])}" loading="lazy"></div>'
                        if find.get("icon")
                        else ""
                    )
                )
                facts = "".join(
                    f"<dt>{label}</dt><dd>{e(find[key])}</dd>"
                    for key, label in [
                        ("biomes", "Биом / измерение"),
                        ("where", "Где смотреть"),
                        ("how", "Как получить"),
                    ]
                    if find.get(key)
                )
                status = (
                    f'<p class="guide-find-status">{e(find["availability"])}</p>'
                    if find.get("availability")
                    else ""
                )
                cards.append(
                    f'<div class="guide-find-card"><h3>{e(find["name"])}</h3>{picture}{status}<dl>{facts}</dl></div>'
                )
            body += '<div class="guide-finds">' + "".join(cards) + "</div>"
        if section.get("links"):
            body += '<div class="guide-more">' + "".join(
                f'<a href="{e(link["href"])}">{e(link["title"])}</a>'
                for link in section["links"]
            ) + "</div>"
        return body

    articles = []
    for t in data["topics"]:
        anchor = lambda s, topic_id=t["id"]: f"section-{topic_id}-{s['id']}"
        members = "".join(
            f"<li>{e(m['name'])} <span>{e(m['version'])}</span></li>"
            for m in t["members"]
        )
        first = "".join(f"<li>{e(s)}</li>" for s in t["firstSteps"])
        images = t.get("images", [])
        sections = ""
        used_images = {0} if images else set()
        for section in t["sections"]:
            content = section_body(section, images)
            used_images.update(
                find["image"] for find in section.get("finds", []) if "image" in find
            )
            sections += "".join(
                f'<span id="section-{e(t["id"])}-{e(alias)}" class="guide-anchor" aria-hidden="true"></span>'
                for alias in section.get("aliases", [])
            )
            if section.get("spoiler"):
                sections += f'<details class="guide-spoiler" id="{anchor(section)}"><summary>{e(section["title"])}</summary>{content}</details>'
            else:
                sections += f'<section class="guide-chapter" id="{anchor(section)}"><h2>{e(section["title"])}</h2>{content}</section>'
            attached = section.get("images", [])
            if attached:
                sections += (
                    ('<div class="guide-image-grid">' if len(attached) > 1 else "")
                    + "".join(figure(images[i]) for i in attached)
                    + ("</div>" if len(attached) > 1 else "")
                )
                used_images.update(attached)
        remaining = [image for i, image in enumerate(images) if i not in used_images]
        if remaining:
            sections += (
                '<div class="guide-image-grid">'
                + "".join(figure(item) for item in remaining)
                + "</div>"
            )
        toc = "".join(
            f'<li><a href="#{anchor(s)}">{e(s["title"])}</a></li>'
            for s in t["sections"]
        )
        faq = "".join(
            f"<details><summary>{e(q['question'])}</summary><p>{e(q['answer'])}</p></details>"
            for q in t["faq"]
        )
        sources = "".join(
            f'<li><a href="{e(s["url"])}" target="_blank" rel="noopener">{e(s["title"])}</a></li>'
            for s in t["sources"]
        )
        more = "".join(
            f'<a href="{e(s["href"])}">{e(s["title"])}</a>' for s in t["deepLinks"]
        )
        related = "".join(
            f'<a href="mod-guide.html?topic={e(id)}#guide-{e(id)}">{e(next(x["title"] for x in data["topics"] if x["id"] == id))}</a>'
            for id in t["related"]
        )
        notes = "".join(f"<p>{e(n)}</p>" for n in t["packNotes"])
        intro = "".join(
            f"<p>{e(p)}</p>" for p in t.get("siteIntro", [t["short"]["summary"]])
        )
        notice = (
            f'<aside class="guide-status"><strong>{e(t["notice"]["title"])}</strong><p>{e(t["notice"]["text"])}</p></aside>'
            if t.get("notice")
            else ""
        )
        articles.append(f'''<article id="guide-{e(t["id"])}" data-guide="{e(t["id"])}" class="player-guide">
<p class="eyebrow">{e(t["group"])} · Wicklen {e(data["packVersion"])}</p><h1>{e(t["title"])}</h1>{notice}
{figure(images[0], lead=True) if images else ""}<div class="guide-intro">{intro}</div>
<details class="guide-toc"><summary>Содержание</summary><nav aria-label="Содержание: {e(t["title"])}"><ol>{toc}</ol></nav></details>
<div class="guide-start"><h2>Быстрый старт</h2><ol>{first}</ol></div><aside class="guide-tip">{e(t["short"]["tip"])}</aside>
{sections}<section class="guide-faq"><h2>Частые вопросы</h2>{faq}</section>
{f"<section><h2>В Wicklen</h2>{notes}</section>" if notes else ""}
{f'<div class="guide-more">{more}</div>' if more else ""}
<section><h2>Связанные гайды</h2><div class="guide-related">{related}</div></section>
<details class="guide-sources"><summary>Версии и источники · проверено {e(data["checkedAt"])}</summary><ul class="guide-members">{members}</ul><ul>{sources}</ul><p>Руководство рассчитано на указанные версии сборки. Более новая wiki может описывать другие рецепты и интерфейсы; при расхождении проверь требования в игре.</p></details>
</article>''')
    html = Template(layout.template("mod-guide.html", root)).substitute(
        pack_version=e(data["packVersion"]),
        topic_count=len(data["topics"]),
        guide_links=links,
        guide_cards=cards,
        articles="".join(articles),
    )
    html = layout.render_page(html, "mod-guide.html", root)

    index = {
        "packVersion": data["packVersion"],
        "topics": [
            {
                "id": t["id"],
                "title": t["title"],
                "group": t["group"],
                "aliases": t["aliases"],
                "summary": t["short"]["summary"],
                "href": href(t),
                "modIds": t["modIds"],
                "preview": {
                    k: t["images"][0][k] for k in ("src", "width", "height", "alt")
                },
            }
            for t in data["topics"]
        ],
    }
    outputs = {
        "mod-guide.html": html + "\n",
        "mod-guide-index.js": "window.WICKLEN_GUIDE_INDEX = "
        + json.dumps(index, ensure_ascii=False, indent=2)
        + ";\n",
    }
    return outputs
