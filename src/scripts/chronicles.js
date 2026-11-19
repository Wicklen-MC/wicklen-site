(() => {
  'use strict';

  // Release sync supplies verified public files; the HTML also has direct static download links.
  const release = window.WICKLEN_CHRONICLES_RELEASE;
  const formatSize = window.WicklenUI.formatBytes;
  const publicPath = value => {
    if (typeof value !== 'string' || !/^https:\/\/downloads\.wicklen\.link\/releases\/[a-zA-Z0-9._/-]+$/.test(value)) return false;
    return !value.split('/').includes('..');
  };
  if (release && release.version === '0.6.0' && release.chroniclesVersion === '0.4.4' && release.updateFrom === '0.5.0') {
    for (const link of document.querySelectorAll('[data-chron-release]')) {
      const file = release[link.dataset.chronRelease];
      if (!file || !publicPath(file.href)) continue;
      link.href = file.href;
      link.download = '';
      const size = formatSize(file.size);
      if (link.dataset.chronRelease === 'update') link.textContent = `Необязательный патч ${release.updateFrom} → ${release.version}${size ? ` · ${size}` : ''}`;
      if (link.dataset.chronRelease === 'full') link.textContent = `Сборка Wicklen ${release.version}${size ? ` · ${size}` : ''}`;
    }
    if (publicPath(release.full?.href) && publicPath(release.update?.href)) {
      document.querySelector('[data-chron-release-note]').textContent = 'В полной сборке — 124 клиентских мода, публичные настройки, перевод и модели Polymer. Включите Wicklen Polymer и ru-mods выше него. С клиентом 0.5.0 достаточно переподключиться. Необязательный патч обновляет только Gateway-настройки для одиночной игры и сведения о выпуске. API-ключ игрокам не нужен.';
    }
  }
})();
