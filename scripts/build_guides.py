#!/usr/bin/env python3
"""Render the player guides and catalog index from the shared, versioned content."""
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def read_data():
    return json.loads((ROOT / 'mod-guides.json').read_text())

def render(data):
    # Reuse the public site's header/footer; interface prototypes never enter here.
    catalog = (ROOT / 'mods.html').read_text()
    header = catalog[catalog.index('<body'):catalog.index('<main')]
    footer = catalog[catalog.index('<footer'):]
    e = lambda s: escape(str(s), quote=True)
    href = lambda t: f'mod-guide.html?topic={t["id"]}#guide-{t["id"]}'
    links = ''.join(f'<a href="{href(t)}" data-guide-link="{e(t["id"])}" data-search="{e(t["title"]+" "+t["aliases"])}">{e(t["title"])}</a>' for t in data['topics'])
    cards = ''.join(f'<a class="guide-card" href="{href(t)}"><small>{e(t["group"])}</small><h2>{e(t["title"])}</h2><p>{e(t["short"]["summary"])}</p></a>' for t in data['topics'])
    articles=[]
    for t in data['topics']:
        members=''.join(f'<li>{e(m["name"])} <span>{e(m["version"])}</span></li>' for m in t['members'])
        first=''.join(f'<li>{e(s)}</li>' for s in t['firstSteps'])
        sections=''.join(f'<section><h3>{e(s["title"])}</h3>'+''.join(f'<p>{e(p)}</p>' for p in s['paragraphs'])+'</section>' for s in t['sections'])
        faq=''.join(f'<details><summary>{e(q["question"])}</summary><p>{e(q["answer"])}</p></details>' for q in t['faq'])
        sources=''.join(f'<li><a href="{e(s["url"])}" target="_blank" rel="noopener">{e(s["title"])}</a></li>' for s in t['sources'])
        more=''.join(f'<a href="{e(s["href"])}">{e(s["title"])}</a>' for s in t['deepLinks'])
        related=''.join(f'<a href="mod-guide.html?topic={e(id)}#guide-{e(id)}">{e(next(x["title"] for x in data["topics"] if x["id"]==id))}</a>' for id in t['related'])
        notes=''.join(f'<p>{e(n)}</p>' for n in t['packNotes'])
        articles.append(f'''<article id="guide-{e(t['id'])}" data-guide="{e(t['id'])}" class="player-guide">
<p class="eyebrow">{e(t['group'])} · Wicklen {e(data['packVersion'])}</p><h1>{e(t['title'])}</h1><p class="guide-lead">{e(t['short']['summary'])}</p>
<div class="guide-start"><h2>С чего начать</h2><ol>{first}</ol></div><aside class="guide-tip">{e(t['short']['tip'])}</aside>
{sections}<section class="guide-faq"><h3>Если что-то не получается</h3>{faq}</section>
{f'<section><h3>В Wicklen</h3>{notes}</section>' if notes else ''}
{f'<div class="guide-more">{more}</div>' if more else ''}
<section><h3>Что рядом</h3><div class="guide-related">{related}</div></section>
<details class="guide-sources"><summary>Версии и источники · проверено {e(data['checkedAt'])}</summary><ul class="guide-members">{members}</ul><ul>{sources}</ul><p>Сведения сверены с составом сборки и материалами авторов. Более новая wiki может описывать возможности, которых ещё нет в установленной версии. Полное игровое прохождение всех механик этой проверкой не заявляется.</p></details>
</article>''')
    html=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Гайды по модам — Wicklen</title><meta name="description" content="Как начать играть с крупными модами Wicklen: техника, классы, алхимия, исследования, питомцы и путешествия. Гайды для состава 0.5.0."><link rel="canonical" href="https://wicklen.link/mod-guide.html"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="site.css"><link rel="stylesheet" href="reference.css"><link rel="stylesheet" href="mod-guide.css"><script src="mod-guide.js" defer></script></head>{header}
<main id="main" class="wrap guide-layout"><aside class="guide-navigation"><a href="mods.html">Все моды и гайды</a><h2>Разобраться в механике</h2><label for="guide-search">Найти гайд</label><input id="guide-search" type="search" placeholder="Магия, питомец, руда…"><p id="guide-search-empty" hidden role="status">Нет подходящих гайдов.</p><nav aria-label="Гайды по модам">{links}</nav></aside><div class="guide-content"><section id="guide-index"><p class="eyebrow">Wicklen {e(data['packVersion'])} · {len(data["topics"])} темы</p><h1>С чего начать<br>и как продвинуться.</h1><p>Гайды по модам, где нужно разобраться в механиках. Связанные дополнения собраны вместе: например, книги, руны и классовое снаряжение.</p><div class="guide-cards">{cards}</div></section><p id="guide-not-found" hidden role="status">Такого гайда нет. Выбери тему из списка.</p>{''.join(articles)}<noscript><p>Без JavaScript ниже доступны все гайды. Для перехода к нужному используй ссылки разделов.</p></noscript></div></main>{footer}'''
    index={'packVersion':data['packVersion'],'topics':[{'id':t['id'],'title':t['title'],'group':t['group'],'aliases':t['aliases'],'summary':t['short']['summary'],'href':href(t),'modIds':t['modIds']} for t in data['topics']]}
    return {'mod-guide.html':html+'\n','mod-guide-index.js':'window.WICKLEN_GUIDE_INDEX = '+json.dumps(index,ensure_ascii=False,indent=2)+';\n'}

def check_generated():
    for name, content in render(read_data()).items():
        if not (ROOT/name).is_file() or (ROOT/name).read_text()!=content:
            raise ValueError(f'{name} is stale; run python3 scripts/build_guides.py')

def main():
    for name, content in render(read_data()).items():
        (ROOT/name).write_text(content)
    print(f'Rendered {len(read_data()["topics"])} player guides and catalog links')

if __name__=='__main__':main()
