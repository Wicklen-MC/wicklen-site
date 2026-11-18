(() => {
  const source = window.MODS;
  const extra = window.WICKLEN_HANDBOOK;
  if (!source || !extra) return;
  const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const overrides = extra.overrides || {};
  const mods = [...source.mods.map(mod => ({...mod, ...(overrides[mod.id] || {})})), ...extra.additions];
  const categoryNames = Object.fromEntries(source.categories.map(category => [category.key, category.label]));
  const grid = document.querySelector('#handbook-grid');
  const search = document.querySelector('#handbook-search');
  const category = document.querySelector('#handbook-category');
  const libraries = document.querySelector('#handbook-libraries');
  const counter = document.querySelector('#handbook-count');
  const side = mod => mod.side === 'server' ? 'Только сервер' : mod.side === 'client' ? 'Только клиент' : 'Клиент и сервер';
  for (const item of source.categories) category.add(new Option(item.label, item.key));
  const ordered = mods.sort((a,b) => (b.group === 'own') - (a.group === 'own') || a.name.localeCompare(b.name, 'ru'));
  const records = ordered.map(mod => {
    const element = document.createElement('details');
    element.id = `mod-${mod.id}`;
    const guide = extra.guideLinks[mod.id];
    element.innerHTML = `<summary>${mod.icon ? `<img src="icons/${escape(mod.id)}.webp" alt="" loading="lazy" onerror="this.hidden=true">` : ''}<span><strong>${escape(mod.name)}</strong><small>${escape(mod.version)} · ${side(mod)}</small></span></summary><div class="reference-body"><p>${escape(mod.description)}</p>${mod.points?.length ? `<ul>${mod.points.map(point => `<li>${escape(point)}</li>`).join('')}</ul>` : ''}<p class="compat-small">${escape(categoryNames[mod.category] || 'Дополнение')} · Minecraft 26.3 / Fabric</p><div class="reference-links">${guide ? `<a href="${escape(guide)}">Подробный гайд →</a>` : ''}<a href="${escape(mod.url)}" target="_blank" rel="noopener">Страница автора ↗</a></div></div>`;
    grid.append(element);
    return {mod, element, text: `${mod.name} ${mod.description} ${(mod.points || []).join(' ')} ${mod.aliases || ''}`.toLocaleLowerCase('ru')};
  });
  search.value = new URLSearchParams(location.search).get('q') || '';
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    for (const record of records) {
      const visible = (!category.value || record.mod.category === category.value) && (libraries.checked || record.mod.category !== 'library') && (!query || record.text.includes(query));
      record.element.hidden = !visible;
      if (visible) count++;
    }
    counter.textContent = `Показано ${count} из ${mods.length} модов сборки ${extra.version}`;
    document.querySelector('#handbook-empty').hidden = count !== 0;
  };
  search.addEventListener('input', render);category.addEventListener('change', render);libraries.addEventListener('change', render);render();
  const anchor = location.hash.slice(1);
  const focused = records.find(record => record.element.id === anchor);
  if (focused) { if (focused.mod.category === 'library') libraries.checked = true;render();focused.element.open = true;focused.element.scrollIntoView({block:'start'}); }
})();
