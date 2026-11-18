(() => {
  const source = window.MODS;
  const extra = window.WICKLEN_HANDBOOK;
  if (!source || !extra) return;
  const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categoryNames = Object.fromEntries(source.categories.map(category => [category.key, category.label]));
  const grid = document.querySelector('#handbook-grid');
  const search = document.querySelector('#handbook-search');
  const category = document.querySelector('#handbook-category');
  const libraries = document.querySelector('#handbook-libraries');
  const version = document.querySelector('#handbook-version');
  const counter = document.querySelector('#handbook-count');
  const params = new URLSearchParams(location.search);
  version.value = params.get('version') === extra.version ? extra.version : source.version;
  search.value = params.get('q') || '';
  for (const item of source.categories) category.add(new Option(item.label, item.key));
  if (categoryNames[params.get('category')]) category.value = params.get('category');
  libraries.checked = params.get('libraries') === '1' || category.value === 'library';
  const side = mod => mod.side === 'server' ? 'Только сервер' : mod.side === 'client' ? 'Только клиент' : 'Клиент и сервер';
  let records = [];
  function filter() {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    for (const record of records) {
      const visible = (!category.value || record.mod.category === category.value) && (libraries.checked || record.mod.category !== 'library') && (!query || record.text.includes(query));
      record.element.hidden = !visible;
      if (visible) count++;
    }
    counter.textContent = `Показано ${count} из ${records.length} модов сборки ${version.value}`;
    document.querySelector('#handbook-empty').hidden = count !== 0;
    const url = new URL(location.href);
    for (const key of ['q', 'category', 'libraries', 'version']) url.searchParams.delete(key);
    if (query) url.searchParams.set('q', search.value.trim());
    if (category.value) url.searchParams.set('category', category.value);
    if (libraries.checked) url.searchParams.set('libraries', '1');
    if (version.value !== source.version) url.searchParams.set('version', version.value);
    history.replaceState(null, '', url);
  }
  function render() {
    const latest = version.value === extra.version;
    const mods = source.mods.map(mod => ({...mod, ...(latest ? extra.overrides[mod.id] || {} : {}), ...(mod.id === 'wicklen-pack-compat' ? {category:'comfort'} : {})}));
    if (latest) mods.push(...extra.additions);
    grid.replaceChildren();
    document.querySelector('#version-status').textContent = latest ? 'Выпуск доступен для скачивания. На игровом сервере пока 0.4.5; новые Herbcraft и Arcana появятся там после обновления.' : 'Этот состав установлен на игровом сервере. Ссылки на скачивание ведут на совместимую сборку 0.4.5.';
    records = mods.sort((a,b) => (b.group === 'own') - (a.group === 'own') || a.name.localeCompare(b.name, 'ru')).map(mod => {
      const element = document.createElement('details');
      element.id = `mod-${mod.id}`;
      const guide = extra.guideLinks[mod.id];
      element.innerHTML = `<summary>${mod.icon ? `<img src="icons/${escape(mod.id)}.webp" alt="" loading="lazy" onerror="this.hidden=true">` : ''}<span><strong>${escape(mod.name)}</strong><small>${escape(mod.version)} · ${side(mod)}${mod.optional ? ' · По желанию' : ''}</small><p class="entry-summary">${escape(mod.description)}</p></span></summary><div class="reference-body">${mod.points?.length ? `<ul>${mod.points.map(point => `<li>${escape(point)}</li>`).join('')}</ul>` : ''}<p class="compat-small">${escape(categoryNames[mod.category] || 'Дополнение')} · Minecraft 26.3 / Fabric</p><div class="reference-links">${guide ? `<a href="${escape(guide)}">Открыть гайд →</a>` : ''}<a href="${escape(mod.url)}" target="_blank" rel="noopener">Страница автора ↗</a></div></div>`;
      grid.append(element);
      return {mod, element, text: `${mod.name} ${mod.description} ${(mod.points || []).join(' ')} ${mod.aliases || ''}`.toLocaleLowerCase('ru')};
    });
    filter();
    focusAnchor();
  }
  function focusAnchor() {
    const focused = records.find(record => record.element.id === location.hash.slice(1));
    if (!focused) return;
    // A shared card link always reveals its destination, even across active filters.
    category.value = '';search.value = '';
    if (focused.mod.category === 'library') libraries.checked = true;
    filter();focused.element.open = true;focused.element.scrollIntoView({block:'start'});
  }
  search.addEventListener('input', filter);category.addEventListener('change', filter);libraries.addEventListener('change', filter);
  version.addEventListener('change', render);window.addEventListener('hashchange', focusAnchor);render();
})();
