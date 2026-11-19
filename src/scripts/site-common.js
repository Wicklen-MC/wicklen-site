(() => {
  'use strict';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatBytes = bytes => {
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    const unit = bytes >= 1e6 ? 1e6 : bytes >= 1e3 ? 1e3 : 1;
    return `${new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2}).format(bytes / unit)} ${unit === 1e6 ? 'МБ' : unit === 1e3 ? 'КБ' : 'Б'}`;
  };
  window.WicklenUI = Object.freeze({escapeHtml, formatBytes});

  const viewer = document.querySelector('#image-viewer');
  let entries = [], active = 0, opener;
  const imageSource = entry => entry.href || entry.querySelector('img').src;
  const group = entry => entry.dataset.imageGroup || entry.closest('[data-guide]')?.dataset.guide || (entry.hasAttribute('data-gallery') ? 'chronicles' : 'page');
  const render = () => {
    const entry = entries[active], image = entry.querySelector('img');
    const source = imageSource(entry);
    const full = viewer.querySelector('#image-viewer-image');
    full.src = source;full.alt = image.alt;
    viewer.querySelector('#image-viewer-title').textContent = image.alt || 'Игровой скриншот';
    viewer.querySelector('#image-viewer-caption').textContent = entry.dataset.caption || entry.closest('figure')?.querySelector('figcaption')?.innerText.trim().replace(/\s+/g, ' ') || '';
    viewer.querySelector('#image-viewer-count').textContent = `${active + 1} / ${entries.length}`;
    viewer.querySelector('#image-viewer-original').href = source;
    for (const button of viewer.querySelectorAll('[data-image-prev], [data-image-next]')) button.hidden = entries.length < 2;
  };
  const move = delta => {active = (active + delta + entries.length) % entries.length;render();};
  const imageSelector = '[data-image-zoom], [data-guide-image], .chron-gallery [data-gallery]';
  document.addEventListener('click', event => {
    const trigger = event.target.closest(`${imageSelector}, [data-open-gallery]`);
    if (!trigger || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const entry = trigger.hasAttribute('data-open-gallery')
      ? [...document.querySelectorAll('.chron-gallery [data-gallery]')].find(item => item.dataset.gallery === trigger.dataset.openGallery) : trigger;
    if (!entry || !entry.querySelector('img')) return;
    if (typeof viewer?.showModal !== 'function') {
      if (trigger.tagName === 'BUTTON') location.href = entry.querySelector('img').src;
      return;
    }
    event.preventDefault();opener = trigger;
    const matching = [...document.querySelectorAll(imageSelector)].filter(item => group(item) === group(entry));
    entries = [...new Map(matching.map(item => [imageSource(item), item])).values()];
    active = entries.findIndex(item => imageSource(item) === imageSource(entry));render();viewer.showModal();document.body.classList.add('modal-open');
  });
  if (viewer) {
    viewer.querySelector('[data-image-close]').addEventListener('click', () => viewer.close());
    viewer.querySelector('[data-image-prev]').addEventListener('click', () => move(-1));
    viewer.querySelector('[data-image-next]').addEventListener('click', () => move(1));
    viewer.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);}
    });
    viewer.addEventListener('click', event => {
      if (event.target !== viewer) return;
      const r = viewer.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) viewer.close();
    });
    viewer.addEventListener('close', () => {document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
  }

  for (const nav of document.querySelectorAll('[data-section-nav]')) {
    const sections = [...nav.querySelectorAll('a[href^="#"]')].map(link => ({link, section:document.getElementById(link.hash.slice(1))})).filter(item => item.section);
    let scheduled = false;
    const select = current => {
      for (const item of sections) item === current ? item.link.setAttribute('aria-current','location') : item.link.removeAttribute('aria-current');
    };
    const update = () => {
      scheduled = false;
      const sticky = nav.closest('.nav-shell');
      const offset = Math.max(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0,
        sticky?.getBoundingClientRect().bottom || 0, document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 24;
      let current = sections[0];
      for (const item of sections) if (item.section.getBoundingClientRect().top <= offset) current = item;
      select(current);
    };
    const followHash = () => {
      update();
      const current = sections.find(item => item.link.hash === location.hash);
      if (current) select(current);
    };
    nav.addEventListener('click', event => {
      const current = sections.find(item => item.link === event.target.closest('a'));
      if (current) select(current);
    });
    addEventListener('scroll', () => {if (!scheduled) {scheduled = true;requestAnimationFrame(update);}}, {passive:true});
    addEventListener('resize', update);
    addEventListener('hashchange', followHash);addEventListener('load', followHash);addEventListener('pageshow', followHash);followHash();
  }
  for (const button of document.querySelectorAll('[data-print-page]')) button.addEventListener('click', () => print());
  let detailsBeforePrint = [];
  addEventListener('beforeprint', () => {detailsBeforePrint = [...document.querySelectorAll('details')].map(item => [item,item.open]);for (const [item] of detailsBeforePrint) item.open = true;});
  addEventListener('afterprint', () => {for (const [item,open] of detailsBeforePrint) item.open = open;});
})();
