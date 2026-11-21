(() => {
  const data = window.WICKLEN_UPDATES;
  if (!data) return;
  const escape = window.WicklenUI.escapeHtml;
  const size = window.WicklenUI.formatBytes;
  const file = item => `<li><div><a href="${escape(item.href)}">${escape(item.label || item.file)} ↓</a><small>${escape(item.file)}${item.bytes ? ` · ${size(item.bytes)}` : ''}${item.side ? ` · ${escape(item.side)}` : ''}</small></div>${item.status ? `<span class="file-status">${escape(item.status)}</span>` : ''}${item.note ? `<small class="file-note">${escape(item.note)}</small>` : ''}${item.sha256 || item.sha512 ? `<details><summary>Контрольная сумма ${item.sha256 ? 'SHA-256' : 'SHA-512'}</summary><code>${escape(item.sha256 || item.sha512)}</code></details>` : ''}</li>`;
  const list = document.querySelector('#release-list');
  for (const release of data.releases) {
    const article = document.getElementById(release.id) || document.createElement('article');article.className = 'release-card';article.id = release.id;
    article.innerHTML = `<span class="release-label">${escape(release.kind)} · ${escape(release.date)}</span><h2>${escape(release.title)}</h2><p>${escape(release.description)}</p>${release.notice ? `<p class="reference-live">${escape(release.notice)}</p>` : ''}<ul>${release.notes.map(note => `<li>${escape(note)}</li>`).join('')}</ul>${release.primary?.length ? `<div class="release-actions">${release.primary.map(item => `<a class="button" href="${escape(item.href)}">${escape(item.label)}${item.bytes ? ` · ${size(item.bytes)}` : ''} ↓</a>`).join('')}</div>` : ''}${release.changes?.length ? `<h3>Что поменялось в файлах</h3><ul class="release-files">${release.changes.map(file).join('')}</ul>` : ''}<details><summary>Все файлы выпуска · ${release.files.length}</summary><ul class="release-files">${release.files.map(file).join('')}</ul></details><p class="compat-small"><a href="${escape(release.releaseUrl)}">Описание и инструкция выпуска ↗</a></p>`;
    list.append(article);
  }
  document.querySelector('#release-counter').textContent = `Выпусков в истории: ${data.releases.length}. На игровом сервере: ${data.liveVersion}.`;
})();
