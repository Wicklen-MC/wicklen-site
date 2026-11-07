(() => {
  'use strict';

  const dialog = document.querySelector('#chron-gallery-dialog');
  const entries = [...document.querySelectorAll('.chron-gallery [data-gallery]')];
  let active = 0;
  let opener = null;

  const render = () => {
    const entry = entries[active];
    const source = entry.querySelector('img');
    const image = dialog.querySelector('#chron-gallery-image');
    image.src = source.src;
    image.alt = source.alt;
    dialog.querySelector('#chron-gallery-caption').textContent = entry.dataset.caption;
    dialog.querySelector('#chron-gallery-count').textContent = `${active + 1} / ${entries.length}`;
    dialog.querySelector('#chron-gallery-title').textContent = entry.closest('figure').querySelector('figcaption').textContent;
  };

  const open = (id, trigger) => {
    const index = entries.findIndex(entry => entry.dataset.gallery === id);
    if (index < 0) return;
    if (!dialog.showModal) {
      window.location.href = entries[index].querySelector('img').src;
      return;
    }
    active = index;
    opener = trigger;
    render();
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('[data-gallery-close]').focus();
  };

  const move = direction => {
    active = (active + direction + entries.length) % entries.length;
    render();
  };

  if (dialog && entries.length) {
    for (const button of document.querySelectorAll('[data-gallery], [data-open-gallery]')) {
      button.addEventListener('click', event => {
        event.preventDefault();
        open(button.dataset.gallery || button.dataset.openGallery, button);
      });
    }
    dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-gallery-prev]').addEventListener('click', () => move(-1));
    dialog.querySelector('[data-gallery-next]').addEventListener('click', () => move(1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      opener?.focus();
    });
  }

  // Release sync supplies verified public files; the HTML also has direct static download links.
  const release = window.WICKLEN_CHRONICLES_RELEASE;
  const formatSize = bytes => typeof bytes === 'number' && Number.isFinite(bytes) && bytes > 0
    ? `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(bytes / 1e6)} МБ` : '';
  const publicPath = value => {
    if (typeof value !== 'string' || !/^https:\/\/downloads\.wicklen\.link\/releases\/[a-zA-Z0-9._/-]+$/.test(value)) return false;
    return !value.split('/').includes('..');
  };
  if (release && release.version === '0.4.4' && release.chroniclesVersion === '0.4.3' && release.updateFrom === '0.4.3') {
    for (const link of document.querySelectorAll('[data-chron-release]')) {
      const file = release[link.dataset.chronRelease];
      if (!file || !publicPath(file.href)) continue;
      link.href = file.href;
      link.download = '';
      const size = formatSize(file.size);
      if (link.dataset.chronRelease === 'update') link.textContent = `Обновление ${release.updateFrom} → ${release.version}${size ? ` · ${size}` : ''}`;
      if (link.dataset.chronRelease === 'full') link.textContent = `Сборка Wicklen ${release.version}${size ? ` · ${size}` : ''}`;
    }
    if (publicPath(release.full?.href) && publicPath(release.update?.href)) {
      document.querySelector('[data-chron-release-note]').textContent = 'В полной сборке — 121 мод, публичные настройки и русский перевод. Обновление с 0.4.3 заменяет только Chronicles 0.4.2 на 0.4.3. Старый JAR нужно удалить; конфиги и личные настройки сохраняются. API-ключ игрокам не нужен.';
    }
  }
})();
