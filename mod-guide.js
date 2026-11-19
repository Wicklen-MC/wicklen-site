(() => {
  const id = new URLSearchParams(location.search).get('topic');
  const articles = [...document.querySelectorAll('[data-guide]')];
  const selected = articles.find(article => article.dataset.guide === id);
  for (const article of articles) article.hidden = article !== selected;
  document.querySelector('#guide-index').hidden = Boolean(selected);
  document.querySelector('#guide-not-found').hidden = !id || Boolean(selected);
  if (selected) {
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
