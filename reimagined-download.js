/* Download original author files directly and return an ordinary, verified ZIP. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const table = Uint32Array.from({length: 256}, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
    return value >>> 0;
  });
  function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) value = (value >>> 8) ^ table[(value ^ byte) & 255];
    return (value ^ 0xffffffff) >>> 0;
  }
  async function digest(algorithm, bytes) {
    const hash = new Uint8Array(await crypto.subtle.digest(algorithm, bytes));
    return Array.from(hash, value => value.toString(16).padStart(2, '0')).join('');
  }
  function buildZip(entries) {
    const pieces = [], directory = [];
    let offset = 0, directorySize = 0;
    for (const entry of [...entries].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)) {
      if (!/^(mods|resourcepacks)\/[^/]+$|^README\.txt$/.test(entry.path) || entry.path.includes('..') || entry.path.includes('\\')) {
        throw new Error('Недопустимое имя файла');
      }
      const name = encoder.encode(entry.path), bytes = entry.bytes, checksum = crc32(bytes);
      const local = new Uint8Array(30 + name.length), header = new DataView(local.buffer);
      header.setUint32(0, 0x04034b50, true); header.setUint16(4, 20, true);
      header.setUint16(6, 0x800, true); header.setUint16(12, 33, true);
      header.setUint32(14, checksum, true); header.setUint32(18, bytes.length, true);
      header.setUint32(22, bytes.length, true); header.setUint16(26, name.length, true); local.set(name, 30);
      pieces.push(local, bytes);
      const central = new Uint8Array(46 + name.length), record = new DataView(central.buffer);
      record.setUint32(0, 0x02014b50, true); record.setUint16(4, 0x314, true);
      record.setUint16(6, 20, true); record.setUint16(8, 0x800, true); record.setUint16(14, 33, true);
      record.setUint32(16, checksum, true); record.setUint32(20, bytes.length, true);
      record.setUint32(24, bytes.length, true); record.setUint16(28, name.length, true);
      record.setUint32(38, 0x81a40000, true); record.setUint32(42, offset, true); central.set(name, 46);
      directory.push(central); directorySize += central.length; offset += local.length + bytes.length;
    }
    const end = new Uint8Array(22), footer = new DataView(end.buffer);
    footer.setUint32(0, 0x06054b50, true); footer.setUint16(8, entries.length, true);
    footer.setUint16(10, entries.length, true); footer.setUint32(12, directorySize, true);
    footer.setUint32(16, offset, true);
    return new Blob([...pieces, ...directory, end], {type: 'application/zip'});
  }
  async function assemble(manifest, fetchFile = fetch, progress = () => {}) {
    let completed = 0;
    const entries = [];
    // Limit concurrent downloads to keep memory use and CDN requests predictable.
    const queue = [...manifest.files];
    async function worker() {
      while (queue.length) {
        const file = queue.shift();
        if (!file.url.startsWith('https://cdn.modrinth.com/')) throw new Error('Неизвестный источник файла');
        const response = await fetchFile(file.url, {credentials: 'omit'});
        if (!response.ok) throw new Error('Не удалось скачать ' + file.path);
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length !== file.bytes || await digest('SHA-512', bytes) !== file.sha512) {
          throw new Error('Проверка файла не прошла: ' + file.path);
        }
        entries.push({path: file.path, bytes}); progress(++completed, manifest.files.length);
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    for (const file of manifest.embedded) {
      const bytes = file.base64
        ? Uint8Array.from(atob(file.base64), char => char.charCodeAt(0)) : encoder.encode(file.text);
      if (await digest('SHA-512', bytes) !== file.sha512) throw new Error('Не совпал пресет Wicklen');
      entries.push({path: file.path, bytes});
    }
    const zip = buildZip(entries);
    if (manifest.zip_sha256 && await digest('SHA-256', await zip.arrayBuffer()) !== manifest.zip_sha256) {
      throw new Error('Проверка архива не прошла');
    }
    return zip;
  }
  globalThis.WicklenVisualZip = {buildZip, assemble};
  if (typeof document === 'undefined') return;
  const buttons = [...document.querySelectorAll('[data-visual-zip]')];
  const statuses = [...document.querySelectorAll('[data-zip-status]')];
  function status(text) { for (const element of statuses) element.textContent = text; }
  for (const button of buttons) {
    button.disabled = false;
    button.addEventListener('click', async () => {
      for (const control of buttons) control.disabled = true;
      status('Подготавливаем ZIP…');
      try {
        const response = await fetch('reimagined-download.json', {cache: 'no-store'});
        if (!response.ok) throw new Error('Не удалось получить состав набора');
        const manifest = await response.json();
        const zip = await assemble(manifest, fetch, (done, total) => status('Скачиваем файлы: ' + done + ' из ' + total + '…'));
        const url = URL.createObjectURL(zip), link = document.createElement('a');
        link.href = url; link.download = manifest.filename; document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        status('ZIP готов. Распакуйте папки mods и resourcepacks в профиль Wicklen.');
      } catch (error) {
        status(error.message + '. Попробуйте скачать ещё раз.');
      } finally {
        for (const control of buttons) control.disabled = false;
      }
    });
  }
})();
