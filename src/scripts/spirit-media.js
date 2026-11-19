(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const scene of document.querySelectorAll('[data-spirit-scene]')) {
    const button = document.querySelector(`[data-spirit-toggle="${scene.id}"]`);
    if (!button) continue;
    let visible = !('IntersectionObserver' in window);
    let pausedByUser = false;
    let manualPlay = false;
    const sync = () => {
      const active = visible && !document.hidden && !reduced.matches && !pausedByUser
        && (manualPlay || !navigator.connection?.saveData);
      scene.classList.toggle('is-animated', active);
      scene.dataset.motion = active ? 'playing' : 'paused';
      button.hidden = reduced.matches;
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? 'Остановить анимацию духа' : 'Включить анимацию духа');
      button.textContent = active ? 'Ⅱ Пауза' : '▷ Анимация';
    };
    button.addEventListener('click', () => {
      pausedByUser = scene.classList.contains('is-animated');
      manualPlay = !pausedByUser;
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    if (reduced.addEventListener) reduced.addEventListener('change', sync);
    else reduced.addListener(sync);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.15 });
      observer.observe(scene);
    }
    sync();
  }
})();
