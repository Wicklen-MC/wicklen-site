#!/usr/bin/env python3
"""Refresh pack download metadata from a verified local release directory.

This prepares authoring data; it does not publish the website or game. The output
describes the intended live release: publish the site only after publishing the
immutable pack files and adopting the pack on the game server.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content'


def load(name):
    return json.loads((CONTENT / (name + '.json')).read_text())


def save(name, data):
    (CONTENT / (name + '.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-dir', type=Path, required=True)
    parser.add_argument('--date', required=True, help='YYYY-MM-DD')
    parser.add_argument('--note', action='append', default=[], help='Additional verified release note')
    parser.add_argument('--live', action='store_true', help='Record confirmed publication and game adoption in the command output')
    args = parser.parse_args()
    directory = args.release_dir.resolve()
    lock_path = directory / 'pack.lock.json'
    lock = json.loads(lock_path.read_text())
    version = lock['pack']['version']
    if version != '0.7.0':
        parser.error('The player-facing release notes in this change describe pack 0.7.0')
    base = f'https://downloads.wicklen.link/releases/{version}/'
    digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
    lock_hash = digest(lock_path)
    sums = directory / f'SHA256SUMS-{version}.txt'
    for line in sums.read_text().splitlines():
        expected, filename = line.split('  ', 1)
        if Path(filename).name != filename or digest(directory / filename) != expected:
            raise ValueError('Invalid release checksum: ' + filename)

    def file(name, label=None):
        path = directory / name
        row = {'file': name, 'bytes': path.stat().st_size, 'sha256': digest(path), 'href': base + name}
        if label:
            row['label'] = label
        return row

    full = file(f'wicklen-{version}-players.zip', 'Полный клиент 0.7.0')
    patch = file('wicklen-0.6.0-to-0.7.0-update.zip', 'Обязательный патч с 0.6.0')
    manifest = json.loads((directory / f'manifest-{version}.json').read_text())
    catalog = load('catalog')
    catalog.update(generated=args.date, version=version, liveVersion=version, total=lock['counts']['unique_mod_files'], downloadBase=base)
    catalog['manifestMods'] = manifest['mods']
    catalog['instructionsText'] = (directory / f'PLAYER-INSTRUCTIONS-{version}.md').read_text()
    catalog['sumsText'] = sums.read_text()
    catalog['catalogSource'].update(path=f'pack/releases/{version}/pack.lock.json', sha256=lock_hash,
                                    packVersion=version, counts=lock['counts'])
    addon = next(m for m in lock['mods'] if m['file'] == 'herbcraft-simple-meals-0.1.0.jar')
    catalog['mods'] = [m for m in catalog['mods'] if m['id'] != 'herbcraft-simple-meals']
    catalog['mods'].append({
        'id': 'herbcraft-simple-meals', 'category': 'farming', 'group': 'own', 'highlight': True,
        'name': addon['name'], 'version': addon['version'], 'side': addon['side'], 'optional': False,
        'file': addon['file'], 'sha512': addon['sha512'], 'install': addon['install'], 'icon': False,
        'description': 'Убирает дополнительные шкалы питания Herbcraft и даёт трём готовым блюдам понятные бонусы для вылазок.',
        'points': ['Обычный голод остаётся; дополнительные шкалы КБЖУ и их штрафы отключены.',
                   'Тыквенная каша снижает расход сытости, рагу ускоряет добычу, суп добавляет броню.',
                   'Активен один бонус блюда; зелья действуют отдельно. Нужен на клиенте и сервере.'],
        'projectId': None, 'versionId': None, 'sourceKind': 'build',
        'sourceCommit': addon['source']['commit'],
        'url': 'https://wicklen.link/mod-guide.html?topic=herbcraft-simple-meals#guide-herbcraft-simple-meals',
        'artifactUrl': addon['source']['download_url']})
    distant = next(m for m in catalog['mods'] if m['name'] == 'Distant Horizons')
    distant['points'] = [
        'Дальний рельеф до 192 чанков — примерно 3 км, когда сервер подготовит LOD.',
        'Упрощённый рельеф появляется постепенно из уже созданных чанков; дополнительная генерация мира не запускается.',
        'Обычная дальность активных чанков не увеличивается. При низком FPS уменьшите дальность Distant Horizons.']
    downloads = [(full, 'main', 'Основная сборка'), (patch, 'update', 'Обязательный патч с 0.6.0'),
                 (file(f'manifest-{version}.json'), 'manifest', 'Точные версии модов'),
                 (file(f'PLAYER-INSTRUCTIONS-{version}.md'), 'instructions', 'Инструкция (текст)'),
                 (file(f'SHA256SUMS-{version}.txt'), 'checksums', 'Суммы SHA-256')]
    def human(size):
        if size >= 1000000:
            return f'{size / 1000000:.1f}'.replace('.', ',') + ' МБ'
        if size >= 1000:
            return f'{size / 1000:.1f}'.replace('.', ',') + ' КБ'
        return str(size) + ' Б'
    catalog['downloads'] = [{**{k: v for k, v in row.items() if k not in ('bytes', 'label')},
                            'kind': kind, 'label': label, 'size': row['bytes'], 'sizeHuman': human(row['bytes'])}
                           for row, kind, label in downloads]
    date = '.'.join(reversed(args.date.split('-')))
    catalog['changelog'] = {'date': date, 'entries': [
        'Herbcraft: Simple Meals отключает дополнительные шкалы питания и их штрафы. Обычный голод, травы, алхимия и открытия сохранены.',
        'Три готовых блюда дают один из бонусов: меньше расход сытости, быстрее добыча или дополнительная броня.',
        'Клиент нужно обновить: закройте игру и установите патч 0.6.0 → 0.7.0 либо полный комплект.',
        'Distant Horizons: радиус LOD на клиенте и сервере — 192 чанка, примерно 3 км. Дальний рельеф появляется постепенно, когда сервер подготовит LOD из уже созданных чанков. Обычная дальность активных чанков не меняется.']}
    catalog['changelog']['entries'].extend(args.note)
    save('catalog', catalog)
    handbook = load('handbook')
    handbook.update(version=version, liveVersion=version, sourceLockSha256=lock_hash)
    handbook['guideLinks']['herbcraft-simple-meals'] = 'mod-guide.html?topic=herbcraft-simple-meals#guide-herbcraft-simple-meals'
    save('handbook', handbook)
    guides = load('mod-guides')
    guides.update(packVersion=version, checkedAt=args.date, sourceLockSha256=lock_hash,
                  verification=f'Рецепты сверены с закреплёнными JAR сборки {version}; правила питания — с Simple Meals 0.1.0.',
                  siteEdition='practical-' + args.date)
    save('mod-guides', guides)
    recipes = load('guide-recipes'); recipes['packVersion'] = version; save('guide-recipes', recipes)
    updates = load('updates')
    updates.update(liveVersion=version, latestVersion=version, installationInProgress=False)
    updates['sourceLocks'][version] = lock_hash
    component_path = next((directory.parent / 'components').glob(addon['file']), None) if (directory.parent / 'components').exists() else None
    component = {'file': addon['file'], 'href': addon['source']['download_url'], 'sha512': addon['sha512'],
                 'label': 'Herbcraft: Simple Meals 0.1.0', 'side': 'клиент и сервер', 'status': 'Добавлен',
                 'note': 'Обязателен для входа. Включён в полный клиент и патч с 0.6.0; отдельно скачивать не нужно.'}
    if component_path:
        component['bytes'] = component_path.stat().st_size
    delta = json.loads((directory / 'UPDATE.json').read_text())
    changes = [component]
    for path in delta['install']:
        if path.startswith('config/'):
            changes.append({'file': path, 'href': patch['href'], 'label': path + ' — внутри патча',
                            'side': 'клиент', 'status': 'Обновлён',
                            'note': 'Distant Horizons: радиус дальнего рельефа 192 чанка. Если уже настраивали DH, сохраните свой config/DistantHorizons.toml вместо замены и выставьте дальность 192 чанка вручную в игре. Иначе скопируйте папку config из патча. Аддон Simple Meals нужен в любом случае.'})
    labels = {f'PLAYER-INSTRUCTIONS-{version}.md': 'Инструкция установки', 'UPDATE.json': 'Состав патча',
              f'manifest-{version}.json': 'Манифест клиента', f'server-manifest-{version}.json': 'Манифест сервера',
              full['file']: 'Полный клиент', patch['file']: 'Патч 0.6.0 → 0.7.0', f'wicklen-{version}-server.zip': 'Серверный комплект',
              'pack.lock.json': 'Точный состав и хеши', f'SHA256SUMS-{version}.txt': 'Контрольные суммы'}
    release = {'id': 'pack-0-7-0', 'kind': 'Сборка', 'date': date, 'title': 'Wicklen 0.7.0',
               'description': 'Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 125 клиентских / 170 серверных JAR. Herbcraft: Simple Meals 0.1.0.',
               'notice': 'Установлено на игровом сервере. Перед входом обновите клиент: нужен патч с 0.6.0 или полный комплект 0.7.0.',
               'notes': catalog['changelog']['entries'] + ['Версии остальных JAR, Chronicles 0.4.4 и Compat 0.1.2 прежние. Настройки Gateway сохранены.'],
               'primary': [full, patch], 'changes': changes,
               'files': [file(name, label) for name, label in labels.items()],
               'releaseUrl': base + f'PLAYER-INSTRUCTIONS-{version}.md'}
    updates['releases'] = [release] + [r for r in updates['releases'] if r['id'] != release['id']]
    save('updates', updates)
    old = load('chronicles-release')
    old.update(version=version, updateFrom='0.6.0')
    for key, row in [('full', full), ('update', patch), ('manifest', file(f'manifest-{version}.json')),
                     ('instructions', file(f'PLAYER-INSTRUCTIONS-{version}.md')), ('checksums', file(f'SHA256SUMS-{version}.txt'))]:
        old[key] = {'href': row['href'], 'sha256': row['sha256'], 'size': row['bytes']}
    save('chronicles-release', old)
    state = 'confirmed live' if args.live else 'prepared locally; publication and live adoption unconfirmed'
    print(f'Synchronized {version}: {lock_hash} ({state})')


if __name__ == '__main__':
    main()
