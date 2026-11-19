(() => {
  const viewer = document.querySelector('#guide-image-viewer');
  let imageTrigger;
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-guide-image]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof viewer?.showModal !== 'function') return;
    event.preventDefault();imageTrigger = link;
    const image = link.querySelector('img');
    const full = document.querySelector('#guide-image-full');
    full.src = link.href;full.alt = image.alt;
    document.querySelector('#guide-image-caption').textContent = link.closest('figure').querySelector('figcaption').innerText;
    document.querySelector('#guide-image-original').href = link.href;
    viewer.showModal();
  });
  document.querySelector('#guide-image-close')?.addEventListener('click', () => viewer.close());
  viewer?.addEventListener('close', () => imageTrigger?.focus());
  const id = new URLSearchParams(location.search).get('topic');
  const articles = [...document.querySelectorAll('[data-guide]')];
  const selected = articles.find(article => article.dataset.guide === id);
  for (const article of articles) article.hidden = article !== selected;
  document.querySelector('#guide-index').hidden = Boolean(selected);
  document.querySelector('#guide-not-found').hidden = !id || Boolean(selected);
  if (selected) {
    const hero = selected.querySelector('.guide-hero img');
    if (hero) { hero.loading = 'eager'; hero.fetchPriority = 'high'; }
    document.title = `${selected.querySelector('h1').textContent} — Wicklen`;
    document.querySelector(`[data-guide-link="${selected.dataset.guide}"]`).setAttribute('aria-current', 'page');
  }
  const search = document.querySelector('#guide-search');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLocaleLowerCase('ru');
    const links = [...document.querySelectorAll('[data-guide-link]')];
    for (const link of links) link.hidden = !link.dataset.search.toLocaleLowerCase('ru').includes(q);
    document.querySelector('#guide-search-empty').hidden = links.some(link => !link.hidden);
  });
})();
