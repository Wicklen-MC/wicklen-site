#!/usr/bin/env python3
"""Render full player manuals while preserving the separate compact Spirit cards."""
import json
import math
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def read_data():
    return json.loads((ROOT / 'mod-guides.json').read_text())

def guide_word_count(topic):
    parts=topic.get('siteIntro',[]) + topic['firstSteps']
    for section in topic['sections']:
        parts+=section['paragraphs']+section.get('steps',[])+section.get('bullets',[])
        parts += [cell for row in section.get('table',{}).get('rows',[]) for cell in row]
    parts += [item[k] for item in topic['faq'] for k in ('question','answer')]
    return len(' '.join(parts).split())

def render(data):
    catalog=(ROOT/'mods.html').read_text()
    header=catalog[catalog.index('<body'):catalog.index('<main')]
    footer=catalog[catalog.index('<footer'):]
    e=lambda s:escape(str(s),quote=True)
    href=lambda t:f'mod-guide.html?topic={t["id"]}#guide-{t["id"]}'
    links=''.join(f'<a href="{href(t)}" data-guide-link="{e(t["id"])}" data-search="{e(t["title"]+" "+t["aliases"])}">{e(t["title"])}</a>' for t in data['topics'])
    cards=''
    for t in data['topics']:
        image=t.get('images',[None])[0]
        preview=f'<img class="guide-card-preview" src="{e(image["src"])}" width="{image["width"]}" height="{image["height"]}" loading="lazy" alt="">' if image else ''
        cards+=f'<a class="guide-card" href="{href(t)}">{preview}<small>{e(t["group"])}</small><h2>{e(t["title"])}</h2><p>{e(t["short"]["summary"])}</p></a>'

    def figure(item):
        label='Снимок Wicklen' if item['origin']=='wicklen' else ('Иллюстрация автора' if item['kind']=='diagram' else 'Снимок автора')
        note=f'<span class="guide-image-note">{e(item["note"])}</span>' if item.get('note') else ''
        return f'<figure class="guide-image"><a href="{e(item["src"])}" class="guide-image-open" data-guide-image target="_blank" aria-label="Увеличить: {e(item["alt"])}"><img src="{e(item["src"])}" width="{item["width"]}" height="{item["height"]}" alt="{e(item["alt"])}" loading="lazy" decoding="async"><span class="guide-image-zoom" aria-hidden="true">Увеличить</span></a><figcaption><strong>{e(item["alt"])}</strong> {e(item["caption"])}<small>{label} · <a href="{e(item["sourceUrl"])}" target="_blank" rel="noopener">{e(item["credit"])}</a></small>{note}</figcaption></figure>'

    def section_body(section):
        body=''.join(f'<p>{e(p)}</p>' for p in section['paragraphs'])
        for field,tag in [('steps','ol'),('bullets','ul')]:
            if section.get(field):body+=f'<{tag} class="guide-{field}">'+''.join(f'<li>{e(s)}</li>' for s in section[field])+f'</{tag}>'
        if table:=section.get('table'):
            headings=''.join(f'<th scope="col">{e(h)}</th>' for h in table['headers'])
            rows=''.join('<tr>'+''.join(f'<td>{"<code>"+e(cell)+"</code>" if cell.startswith("/") else e(cell)}</td>' for cell in row)+'</tr>' for row in table['rows'])
            body+=f'<div class="guide-table-scroll" role="region" aria-label="{e(section["title"])}" tabindex="0"><table><thead><tr>{headings}</tr></thead><tbody>{rows}</tbody></table></div>'
        return body

    articles=[]
    for t in data['topics']:
        anchor=lambda s:f'section-{t["id"]}-{s["id"]}'
        members=''.join(f'<li>{e(m["name"])} <span>{e(m["version"])}</span></li>' for m in t['members'])
        first=''.join(f'<li>{e(s)}</li>' for s in t['firstSteps'])
        images=t.get('images',[])
        sections='';used_images={0} if images else set()
        for section in t['sections']:
            content=section_body(section)
            if section.get('spoiler'):
                sections+=f'<details class="guide-spoiler" id="{anchor(section)}"><summary>{e(section["title"])}</summary>{content}</details>'
            else:
                sections+=f'<section class="guide-chapter" id="{anchor(section)}"><h2>{e(section["title"])}</h2>{content}</section>'
            attached=section.get('images',[])
            if attached:
                sections+=('<div class="guide-image-grid">' if len(attached)>1 else '')+''.join(figure(images[i]) for i in attached)+('</div>' if len(attached)>1 else '')
                used_images.update(attached)
        remaining=[image for i,image in enumerate(images) if i not in used_images]
        if remaining:sections+='<div class="guide-image-grid">'+''.join(figure(item) for item in remaining)+'</div>'
        toc=''.join(f'<li><a href="#{anchor(s)}">{e(s["title"])}</a></li>' for s in t['sections'])
        faq=''.join(f'<details><summary>{e(q["question"])}</summary><p>{e(q["answer"])}</p></details>' for q in t['faq'])
        sources=''.join(f'<li><a href="{e(s["url"])}" target="_blank" rel="noopener">{e(s["title"])}</a></li>' for s in t['sources'])
        more=''.join(f'<a href="{e(s["href"])}">{e(s["title"])}</a>' for s in t['deepLinks'])
        related=''.join(f'<a href="mod-guide.html?topic={e(id)}#guide-{e(id)}">{e(next(x["title"] for x in data["topics"] if x["id"]==id))}</a>' for id in t['related'])
        notes=''.join(f'<p>{e(n)}</p>' for n in t['packNotes'])
        intro=''.join(f'<p>{e(p)}</p>' for p in t.get('siteIntro',[t['short']['summary']]))
        goal=f'<p class="guide-goal"><strong>Что получится:</strong> {e(t["siteGoal"])}</p>' if t.get('siteGoal') else ''
        minutes=math.ceil(guide_word_count(t)/180)
        articles.append(f'''<article id="guide-{e(t['id'])}" data-guide="{e(t['id'])}" class="player-guide">
<p class="eyebrow">{e(t['group'])} · Wicklen {e(data['packVersion'])}</p><h1>{e(t['title'])}</h1><p class="guide-reading">Руководство · около {minutes} мин чтения</p><div class="guide-intro">{intro}</div>{goal}
<details class="guide-toc" open><summary>Содержание · {len(t['sections'])} разделов</summary><nav aria-label="Содержание: {e(t['title'])}"><ol>{toc}</ol></nav></details>
{figure(images[0]) if images else ''}
<div class="guide-start"><h2>Быстрый старт</h2><ol>{first}</ol></div><aside class="guide-tip">{e(t['short']['tip'])}</aside>
{sections}<section class="guide-faq"><h2>Частые вопросы</h2>{faq}</section>
{f'<section><h2>В Wicklen</h2>{notes}</section>' if notes else ''}
{f'<div class="guide-more">{more}</div>' if more else ''}
<section><h2>Связанные гайды</h2><div class="guide-related">{related}</div></section>
<details class="guide-sources"><summary>Версии и источники · проверено {e(data['checkedAt'])}</summary><ul class="guide-members">{members}</ul><ul>{sources}</ul><p>Руководство рассчитано на указанные версии сборки. Более новая wiki может описывать другие рецепты и интерфейсы; при расхождении проверь требования в игре.</p></details>
</article>''')
    html=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Гайды по модам — Wicklen</title><meta name="description" content="Подробные руководства по модам Wicklen: подготовка, рецепты, развитие, примеры и решение проблем. Для сборки 0.5.0."><link rel="canonical" href="https://wicklen.link/mod-guide.html"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="site.css"><link rel="stylesheet" href="reference.css"><link rel="stylesheet" href="mod-guide.css"><script src="mod-guide.js" defer></script></head>{header}
<main id="main" class="wrap guide-layout"><aside class="guide-navigation"><a href="mods.html">Все моды и гайды</a><h2>Разобраться в механике</h2><label for="guide-search">Найти гайд</label><input id="guide-search" type="search" placeholder="Магия, питомец, руда…"><p id="guide-search-empty" hidden role="status">Нет подходящих гайдов.</p><nav aria-label="Гайды по модам">{links}</nav></aside><div class="guide-content"><section id="guide-index"><p class="eyebrow">Wicklen {e(data['packVersion'])} · {len(data['topics'])} темы</p><h1>Разобраться<br>и пройти дальше.</h1><p>Подробные руководства: что подготовить, как начать, куда развиваться и что проверить при затруднениях. Связанные моды собраны в одну статью, со скриншотами и источниками.</p><div class="guide-cards">{cards}</div></section><p id="guide-not-found" hidden role="status">Такого гайда нет. Выбери тему из списка.</p>{''.join(articles)}<noscript><p>Без JavaScript доступны все руководства. Для перехода к нужному используй ссылки разделов и оглавления.</p></noscript></div></main><dialog id="guide-image-viewer" aria-label="Игровой снимок крупным планом"><button type="button" id="guide-image-close" autofocus>Закрыть</button><figure><img id="guide-image-full" alt=""><figcaption id="guide-image-caption"></figcaption></figure><a id="guide-image-original" target="_blank" rel="noopener">Открыть изображение отдельно</a></dialog>{footer}'''
    index={'packVersion':data['packVersion'],'topics':[{'id':t['id'],'title':t['title'],'group':t['group'],'aliases':t['aliases'],'summary':t['short']['summary'],'href':href(t),'modIds':t['modIds']} for t in data['topics']]}
    return {'mod-guide.html':html+'\n','mod-guide-index.js':'window.WICKLEN_GUIDE_INDEX = '+json.dumps(index,ensure_ascii=False,indent=2)+';\n'}

def check_generated():
    for name,content in render(read_data()).items():
        if not (ROOT/name).is_file() or (ROOT/name).read_text()!=content:
            raise ValueError(f'{name} is stale; run python3 scripts/build_guides.py')

def main():
    data=read_data()
    for name,content in render(data).items():(ROOT/name).write_text(content)
    print(f'Rendered {len(data["topics"])} full player guides and catalog links')

if __name__=='__main__':main()
