"""Render crafting, furnace and cooking recipes from pinned recipe data."""

from collections import Counter
from html import escape


def render_recipes(ids, recipe_data):
    e = lambda value: escape(str(value), quote=True)

    def item(ref, slot=False):
        entry = recipe_data["items"][ref]
        icon = (
            f'<img src="{e(entry["icon"])}" alt="" width="32" height="32" loading="lazy">'
            if entry.get("icon")
            else f'<span aria-hidden="true" class="recipe-initial">{e(entry["label"][0])}</span>'
        )
        return f'<span class="recipe-item{" recipe-slot" if slot else ""}" title="{e(entry["label"])}">{icon}<span class="{"visually-hidden" if slot else "recipe-item-label"}">{e(entry["label"])}</span></span>'

    def cards(ids):
        cards = []
        for id in ids:
            entry = recipe_data["recipes"][id]
            r = entry["raw"]
            result = r["result"]
            kind = r["type"]
            refs = []
            if r.get("pattern"):
                for row in r["pattern"]:
                    refs += [r["key"].get(char) for char in row.ljust(3)]
                refs += [None] * (9 - len(refs))
                station = "Верстак · расположение как на схеме"
            elif kind == "minecraft:smelting":
                refs = [r["ingredient"]]
                station = "Печь · положи ингредиент сверху, топливо снизу"
            else:
                refs = r["ingredients"]
                station = (
                    "Кастрюля Farmer’s Delight · под ней нужен огонь"
                    if kind == "farmersdelight:cooking"
                    else "Верстак · расположение любое"
                )
            counts = Counter(ref for ref in refs if ref)
            slots = "".join(
                item(ref, slot=True)
                if ref
                else '<span class="recipe-slot recipe-empty" aria-hidden="true"></span>'
                for ref in refs
            )
            grid = f'<div class="recipe-grid{" recipe-single" if kind == "minecraft:smelting" else ""}" aria-label="Ингредиенты">{slots}</div>'
            legend = "".join(
                f"<li><strong>{count} ×</strong> {item(ref)}</li>"
                for ref, count in counts.items()
            )
            count = result.get("count", 1)
            cards.append(
                f'<div class="recipe-card" id="recipe-{e(id)}"><h3>{e(recipe_data["items"][result["id"]]["label"])} <small>×{count}</small></h3><p class="recipe-station">{e(station)}</p><div class="recipe-workbench">{grid}<span class="recipe-arrow" aria-hidden="true">→</span><div class="recipe-output">{item(result["id"], slot=True)}<strong>×{count}</strong></div></div><ul class="recipe-ingredients" aria-label="Сколько нужно">{legend}</ul><details class="recipe-source"><summary>Рецепт из нашей сборки</summary><p>{e(entry["jar"])}</p><code>{e(entry["resource"])}</code></details></div>'
            )
        return '<div class="recipe-cards">' + "".join(cards) + "</div>"

    return cards(ids)
