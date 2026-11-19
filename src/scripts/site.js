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
  const esc = window.WicklenUI.escapeHtml;
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
  $$('[data-total-count]').forEach(el => { el.textContent = D.mods.length; });
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
})();
