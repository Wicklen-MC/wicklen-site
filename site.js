(() => {
  'use strict';
  const D = window.MODS;
  const deployment = window.WICKLEN_DEPLOYMENT;
  const serverAddress = typeof deployment?.server === 'string' ? deployment.server.trim() : '';
  if (D) D.server = serverAddress;
  const serverPlaceholder = 'Адрес сервера появится здесь';
  const experiences = window.EXPERIENCES || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
    mountain: '<path d="m2 20 7-14 7 14zm11-6 4-9 6 15h-7M6 12l3 2 3-2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    gear: '<path d="m10 3-.6 3-2.5 1-2.6-1.5-2 3.5 2.2 2v2l-2.2 2 2 3.5L7 17l2.5 1 .5 3h4l.6-3 2.5-1 2.6 1.5 2-3.5-2.2-2v-2l2.2-2-2-3.5L17 7l-2.5-1-.5-3z"/><circle cx="12" cy="12" r="3"/>',
    spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
    paw: '<ellipse cx="5" cy="9" rx="2" ry="3"/><ellipse cx="10" cy="5" rx="2" ry="3"/><ellipse cx="16" cy="5" rx="2" ry="3"/><ellipse cx="21" cy="10" rx="2" ry="3"/><path d="M6 19c-2-3 2-9 6-9s9 6 6 9c-1.5 2-4 0-6 0s-4.5 2-6 0z"/>',
    home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-8h6v8"/>',
    sprout: '<path d="M12 21v-9M12 13C3 13 3 4 3 4s9-1 9 9zm0 2c0-10 9-10 9-10s1 10-9 10z"/>',
    backpack: '<rect x="5" y="6" width="14" height="15" rx="3"/><path d="M9 6V4a3 3 0 0 1 6 0v2M8 14h8v5H8zm1-8v4m6-4v4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    book: '<path d="M12 5v16M3 3c4 0 6 0 9 2 3-2 5-2 9-2v16c-4 0-6 0-9 2-3-2-5-2-9-2z"/>',
    leaf: '<path d="M20 3C9 2 1 8 5 16s16 6 15-13zM4 21 16 9"/>',
    moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11z"/>',
    box: '<path d="m3 7 9-4 9 4v11l-9 4-9-4zm0 0 9 4 9-4m-9 4v11M7 5l9 4"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.box}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  if (!D) return;
  const modById = new Map(D.mods.map(m => [m.id, m]));
  const categoryByKey = new Map(D.categories.map(c => [c.key, c]));
  const byKind = kind => (D.downloads || []).find(d => d.kind === kind);
  const downloadUrl = d => `downloads/${encodeURIComponent(d.file)}`;
  const mainMods = (D.manifestMods || []).filter(m => !m.optional);
  const modal = $('#detail-dialog');
  let modalTrigger = null;
  let modHashOpen = false;

  function showDialog({ title, subtitle = '', body, footer = '', image = '' }, trigger) {
    if (!modal) return;
    modalTrigger = trigger || document.activeElement;
    $('#dialog-title').textContent = title;
    $('#dialog-subtitle').textContent = subtitle;
    $('#dialog-body').innerHTML = body;
    $('#dialog-foot').innerHTML = footer;
    const img = $('#dialog-image');
    img.hidden = !image;
    if (image) img.src = image; else img.removeAttribute('src');
    if (!modal.open) modal.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog() { if (modal?.open) modal.close(); }
  if (modal) {
    $('.dialog-close', modal).addEventListener('click', closeDialog);
    modal.addEventListener('click', event => {
      const box = modal.getBoundingClientRect();
      if (event.target === modal && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) closeDialog();
    });
    modal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (modHashOpen && location.hash.startsWith('#mod-')) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      modHashOpen = false;
      if (modalTrigger?.isConnected) modalTrigger.focus({ preventScroll: true });
    });
  }
  $$('[data-copy-server]').forEach(button => {
    const value = $('[data-server-value]', button);
    if (value) value.textContent = serverAddress || serverPlaceholder;
    button.disabled = !serverAddress;
    button.setAttribute('aria-label', serverAddress ? 'Скопировать адрес сервера' : serverPlaceholder);
    $('[data-icon="copy"]', button)?.toggleAttribute('hidden', !serverAddress);
    if (!serverAddress) return;
    button.addEventListener('click', async () => {
      let copied = false;
      try { await navigator.clipboard.writeText(serverAddress); copied = true; }
      catch {
        const field = document.createElement('textarea');
        field.value = serverAddress;
        field.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(field); field.select();
        try { copied = document.execCommand('copy'); } finally { field.remove(); button.focus(); }
      }
      const feedback = document.getElementById(button.getAttribute('aria-describedby'));
      if (feedback) {
        feedback.textContent = copied ? 'Адрес скопирован' : `Скопируйте адрес: ${serverAddress}`;
        if (copied) setTimeout(() => { feedback.textContent = ''; }, 2200);
      }
    });
  });
  $$('[data-server]').forEach(el => { el.textContent = serverAddress || serverPlaceholder; });
  $$('[data-download]').forEach(link => {
    const d = byKind(link.dataset.download);
    if (!d) { link.hidden = true; return; }
    link.href = downloadUrl(d);
    const size = $('[data-size]', link);
    if (size) size.textContent = d.sizeHuman;
  });
  $$('[data-main-count]').forEach(el => { el.textContent = mainMods.length; });
  $$('[data-total-count]').forEach(el => { el.textContent = D.mods.length; });
  if ($('#latest-date')) $('#latest-date').textContent = D.changelog?.date || '';
  if ($('#latest-summary')) $('#latest-summary').textContent = D.changelog?.entries?.[0] || '';
  if ($('#changelog-list')) $('#changelog-list').innerHTML = (D.changelog?.entries || []).map(entry => `<li>${esc(entry)}</li>`).join('');

  function renderMarkdown(source) {
    const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    const out = []; let list = null;
    const close = () => { if (list) out.push(`</${list}>`); list = null; };
    for (const raw of String(source || '').split('\n')) {
      const line = raw.trim();
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      const item = line.match(/^(- |\d+\.\s+)(.+)$/);
      if (heading) { close(); const level = Math.min(heading[1].length + 1, 4); out.push(`<h${level}>${inline(heading[2])}</h${level}>`); }
      else if (item) { const type = item[1] === '- ' ? 'ul' : 'ol'; if (list !== type) { close(); out.push(`<${type}>`); list = type; } out.push(`<li>${inline(item[2])}</li>`); }
      else { close(); if (line) out.push(`<p>${inline(line)}</p>`); }
    }
    close(); return out.join('');
  }
  if ($('#full-guide')) $('#full-guide').innerHTML = renderMarkdown(D.instructionsText);

  $$('[data-pack-detail]').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.packDetail;
    if (kind === 'checksums') {
      const listedFiles = new Set((D.downloads || []).map(d => d.file));
      const sums = (D.sumsText || '').split('\n').filter(line => {
        const match = line.match(/^[a-f\d]{64}\s+\*?(.+)$/i);
        return match && listedFiles.has(match[1]);
      }).join('\n');
      showDialog({ title: 'Проверка файлов', subtitle: 'SHA-256 файлов, доступных на сайте', body: `<p>Сравните SHA-256 скачанного файла с соответствующей строкой. Совпадение подтверждает, что файл скачался целиком.</p><pre>${esc(sums)}</pre>`, footer: '<a href="downloads/SHA256SUMS.txt" download>Скачать полный файл сумм</a>' }, button);
    } else {
      showDialog({ title: 'Основной архив', subtitle: `${mainMods.length} обязательных клиентских модов`, body: `<p>Состав основного ZIP. Необязательные оптимизаторы и графические дополнения скачиваются отдельно.</p><table><thead><tr><th scope="col">Мод</th><th scope="col">Версия</th></tr></thead><tbody>${mainMods.map(m => `<tr><td>${esc(m.name)}</td><td>${esc(m.version)}</td></tr>`).join('')}</tbody></table>`, footer: '<a href="downloads/manifest.json" download>Скачать манифест всех наборов</a><a href="mods.html">Открыть каталог модов</a>' }, button);
    }
  }));

  const experiencesRoot = $('#experiences');
  if (experiencesRoot) {
    experiencesRoot.innerHTML = experiences.map((item, index) => {
      const count = D.mods.filter(m => m.category === item.key).length;
      const images = item.samples.map(id => modById.get(id)).filter(m => m?.icon).map(m => `<img src="icons/${esc(m.id)}.webp" width="27" height="27" alt="${esc(m.name)}" loading="lazy">`).join('');
      return `<article class="experience" style="--tint:${item.tint};--accent:${item.accent}"><div class="experience-top"><span class="category-icon">${icon(item.icon)}</span><span class="experience-number">${String(index + 1).padStart(2, '0')}</span></div><h3>${esc(item.title)}</h3><p class="subtitle">${esc(item.subtitle)}</p><div class="experience-body"><p>${item.intro}</p><ul>${item.examples.map(([lead, text]) => `<li><strong>${esc(lead)}</strong> ${esc(text)}</li>`).join('')}</ul></div><div class="experience-foot"><div class="mod-icons">${images}</div><a href="mods.html?category=${encodeURIComponent(item.key)}">${count} ${modWord(count)} в каталоге <span aria-hidden="true">↗</span></a></div></article>`;
    }).join('');
    // Preserve links shared before the catalogue moved to its own page.
    if (location.hash.startsWith('#mod-')) {
      const id = location.hash.slice(5);
      if (modById.has(id)) location.replace(`mods.html#mod-${encodeURIComponent(id)}`);
    }
  }

  function modWord(n) {
    return n % 10 === 1 && n % 100 !== 11 ? 'мод' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'мода' : 'модов';
  }
  const grid = $('#mod-grid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const query = $('#mod-search');
  const libraries = $('#show-libraries');
  const pageSize = 24;
  let category = categoryByKey.has(params.get('category')) ? params.get('category') : null;
  let pageNumber = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);
  query.value = params.get('q') || '';
  libraries.checked = params.get('libraries') === '1' || category === 'library';

  function updateUrl() {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    if (query.value.trim()) next.set('q', query.value.trim());
    if (libraries.checked) next.set('libraries', '1');
    if (pageNumber > 1) next.set('page', String(pageNumber));
    history.replaceState(null, '', location.pathname + (next.size ? `?${next}` : '') + location.hash);
  }
  function renderFilters() {
    const categories = [{ key: null, label: 'Все категории' }, ...D.categories.filter(c => c.key !== 'library' || libraries.checked)];
    $('#category-filters').innerHTML = categories.map(c => {
      const count = D.mods.filter(m => (!c.key || m.category === c.key) && (libraries.checked || m.category !== 'library')).length;
      return `<button type="button" class="filter" data-category="${esc(c.key || '')}" aria-pressed="${category === c.key}"><span>${esc(c.label)}</span><span class="count">${count}</span></button>`;
    }).join('');
  }
  function render({ syncUrl = true } = {}) {
    const search = query.value.trim().toLocaleLowerCase('ru');
    const matching = D.mods.filter(m => (!category || m.category === category) && (libraries.checked || m.category !== 'library') && (!search || [m.name, m.description, ...(m.points || [])].join(' ').toLocaleLowerCase('ru').includes(search)));
    const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    pageNumber = Math.min(pageNumber, pageCount);
    const start = (pageNumber - 1) * pageSize;
    const shown = matching.slice(start, start + pageSize);
    $('#result-count').textContent = matching.length ? `${start + 1}–${start + shown.length} из ${matching.length}` : 'Ничего не найдено';
    const experience = experiences.find(c => c.key === category);
    $('#active-category').textContent = category ? categoryByKey.get(category).label : 'Все игровые направления';
    $('#active-description').textContent = experience?.subtitle || (category === 'library' ? 'Зависимости других модов. Отдельных игровых механик обычно не добавляют.' : category === 'performance' ? 'Оптимизация, стабильность и инструменты администратора. Необязательные моды отмечены отдельно.' : 'Моды клиента и сервера. Откройте карточку, чтобы узнать, что добавляет мод и как он влияет на игру.');
    grid.innerHTML = shown.length ? shown.map(m => {
      const img = m.icon ? `<img src="icons/${esc(m.id)}.webp" alt="" width="36" height="36" loading="lazy">` : `<span class="mod-placeholder">${icon(experiences.find(e => e.key === m.category)?.icon || 'box')}</span>`;
      return `<button type="button" class="mod-card" data-mod="${esc(m.id)}" aria-label="Подробнее: ${esc(m.name)}"><div class="mod-card-top">${img}<h3>${esc(m.name)}</h3></div><p>${esc(m.description)}</p><div class="mod-card-meta"><span>${esc(categoryByKey.get(m.category)?.label || m.category)}</span><span>${m.side === 'client' ? 'Клиент' : m.side === 'server' ? 'Сервер' : 'Клиент и сервер'}</span>${m.optional ? '<span class="optional">По желанию</span>' : ''}</div></button>`;
    }).join('') : '<div class="empty-state"><h3>Такого мода не нашлось</h3><p>Попробуйте другое название, выберите другую категорию или включите библиотеки.</p></div>';
    $('#page-label').textContent = `${pageNumber} / ${pageCount}`;
    $('#prev-page').disabled = pageNumber <= 1;
    $('#next-page').disabled = pageNumber >= pageCount;
    $('#pagination').hidden = pageCount <= 1;
    $('#reset-filters').hidden = !category && !query.value && !libraries.checked;
    renderFilters();
    if (syncUrl) updateUrl();
  }
  $('#category-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    category = button.dataset.category || null; pageNumber = 1; render();
  });
  query.addEventListener('input', () => { pageNumber = 1; render(); });
  libraries.addEventListener('change', () => {
    if (!libraries.checked && category === 'library') category = null;
    pageNumber = 1; render();
  });
  $('#reset-filters').addEventListener('click', () => { category = null; query.value = ''; libraries.checked = false; pageNumber = 1; render(); query.focus(); });
  for (const [id, delta] of [['prev-page', -1], ['next-page', 1]]) {
    $(id === 'prev-page' ? '#prev-page' : '#next-page').addEventListener('click', () => {
      pageNumber += delta; render(); $('#catalog-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#active-category').focus({ preventScroll: true });
    });
  }
  function openMod(id, trigger, syncHash = true) {
    const m = modById.get(id);
    if (!m) return;
    const subtitle = [categoryByKey.get(m.category)?.label, m.version, m.optional ? 'Необязательный мод' : null].filter(Boolean).join(' · ');
    showDialog({ title: m.name, subtitle, image: m.icon ? `icons/${m.id}.webp` : '', body: `<p>${esc(m.description)}</p><ul>${(m.points || []).map(point => `<li>${esc(point)}</li>`).join('')}</ul>`, footer: `<a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">Страница мода на Modrinth ↗</a>` }, trigger);
    modHashOpen = true;
    if (syncHash) history.replaceState(null, '', location.pathname + location.search + `#mod-${encodeURIComponent(id)}`);
  }
  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-mod]');
    if (card) openMod(card.dataset.mod, card);
  });
  function handleHash() {
    if (location.hash.startsWith('#mod-')) {
      const id = location.hash.slice(5);
      if (modById.has(id)) openMod(id, null, false);
    } else if (modHashOpen) closeDialog();
  }
  window.addEventListener('hashchange', handleHash);
  window.addEventListener('popstate', () => {
    const next = new URLSearchParams(location.search);
    category = categoryByKey.has(next.get('category')) ? next.get('category') : null;
    query.value = next.get('q') || '';
    libraries.checked = next.get('libraries') === '1' || category === 'library';
    pageNumber = Math.max(1, Number.parseInt(next.get('page'), 10) || 1);
    render({ syncUrl: false }); handleHash();
  });
  render(); handleHash();
})();
