window.WICKLEN_UPDATES = {
  "liveVersion": "0.6.0",
  "latestVersion": "0.6.0",
  "sourceLocks": {
    "0.4.2": "7cb2c67ada91ce6eaf19dde2cc40e090da851cf6ee4fcbf71ce696f450a18003",
    "0.4.3": "cd499423a7b51636668fa21942aa652cb014d110778fcd9579e7fc8c46c248fe",
    "0.4.4": "786f162a6da9f209601061c7817128a45f199b66004ff6ef3fc244fc80317f69",
    "0.4.5": "3579e2d88e83a2a397f7ea3ea07b4e4a8d6dac7c08e8c1356708d567467a0fde",
    "0.5.0": "f87d11782b46267e5b41898b254417cfe1acbd6f3afe02913566f4a485d24051",
    "0.6.0": "978f9a019efceccd08745f9355e61ed8d0734d856ad43fac1f1d5f9e0bb98483"
  },
  "releases": [
    {
      "id": "pack-0-6-0",
      "kind": "Сборка",
      "date": "19.11.2026",
      "title": "Wicklen 0.6.0",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 124 клиентских / 169 серверных JAR. Состав модов прежний.",
      "notice": "Установлено на игровом сервере. С клиентом 0.5.0 достаточно переподключиться; обязательного обновления файлов нет.",
      "notes": [
        "Gateway: ключи снова находятся в сундуках и выпадают с мобов, доступны Runeroot, Reaper, Voidwing и Azure Ronin. Дворы Chronicles сохранены.",
        "В обычном мире случайно появляются Runestone и более редкие Golden Rune. В Незере и Крае Golden Rune работает по таймеру 30–90 минут; событие не гарантировано.",
        "В новых чанках возвращены три редких деревни Repurposed Structures. Максимальная волна орды увеличена с 8 до 10; интервал 7 дней, предел 24 и отключённый TNT сохранены.",
        "JAR, перевод, модели Polymer и Java/Fabric не изменились. Chronicles 0.4.4 и Compat 0.1.2 прежние. Необязательный патч переносит только Gateway-конфиг и сведения о выпуске."
      ],
      "primary": [
        {
          "file": "wicklen-0.6.0-players.zip",
          "bytes": 463183154,
          "sha256": "ebe1f2e8548951707ea942a20616fb3fca17931094fd9e04771db00bcad2c087",
          "href": "https://downloads.wicklen.link/releases/0.6.0/wicklen-0.6.0-players.zip",
          "label": "Полный клиент 0.6.0"
        },
        {
          "file": "wicklen-0.5.0-to-0.6.0-update.zip",
          "bytes": 125079,
          "sha256": "d96fa1e6f857dd577a4d357f1648f75106f2373bd429a4aeb4ebcccd9f9d8757",
          "href": "https://downloads.wicklen.link/releases/0.6.0/wicklen-0.5.0-to-0.6.0-update.zip",
          "label": "Необязательный патч с 0.5.0"
        }
      ],
      "changes": [
        {
          "file": "config/gateway_of_doom.json",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.6.0/gateway_of_doom.json",
          "sha256": "15672129c10c438b877cd92b2e057f4612c3b8302caf562d6aed84a0fc24eefa",
          "bytes": 80733,
          "side": "сервер",
          "status": "Обновлён",
          "note": "Возвращены шесть стандартных профилей, ключи, четыре босса и автоматические порталы. Оба двора Chronicles сохранены."
        },
        {
          "file": "config/cristellib/repurposed_structures/structure_toggle_config.json5",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.6.0/structure_toggle_config.json5",
          "sha256": "9d7ea7ac68ed4c6ce776e4eeebe803ecd40a1639e5347b7bcf77add0511d926f",
          "bytes": 4725,
          "side": "сервер",
          "status": "Обновлён",
          "note": "Включены редкие деревни в бамбуковых джунглях, гигантской тайге и горах. Появляются только в новых чанках."
        },
        {
          "file": "config/undeadnights_horde_mobs_config.json",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.6.0/undeadnights_horde_mobs_config.json",
          "sha256": "c8d046c21e6ecae9d3ff9852153229e17d1098934ca7f4fdf9766c02bb056fe3",
          "bytes": 406,
          "side": "сервер",
          "status": "Обновлён",
          "note": "Максимальная волна 8 → 10. Интервал 7 дней и предел 24 одновременно загруженных мобов сохранены."
        },
        {
          "file": "config/gateway_of_doom.json",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.6.0/gateway_of_doom.json",
          "sha256": "15672129c10c438b877cd92b2e057f4612c3b8302caf562d6aed84a0fc24eefa",
          "bytes": 80733,
          "side": "клиент, необязательно",
          "status": "Обновлён",
          "note": "Те же настройки для одиночной игры. Для входа на сервер с клиентом 0.5.0 копировать файл не требуется."
        }
      ],
      "files": [
        {
          "file": "PLAYER-INSTRUCTIONS-0.6.0.md",
          "bytes": 771,
          "sha256": "b95c19bb3a980e48313bdc706e774d441d60eb441ebfef3ad4af986cf9a6e1ce",
          "href": "https://downloads.wicklen.link/releases/0.6.0/PLAYER-INSTRUCTIONS-0.6.0.md",
          "label": "Инструкция установки"
        },
        {
          "file": "UPDATE.json",
          "bytes": 279,
          "sha256": "0c649bf5148c2cb8a6a4ff65b2a68fe4b47b107ceb70679a3d3a4ceb57069357",
          "href": "https://downloads.wicklen.link/releases/0.6.0/UPDATE.json",
          "label": "Состав необязательного патча"
        },
        {
          "file": "manifest-0.6.0.json",
          "bytes": 43433,
          "sha256": "d650b873f456962189e456883266bbe901bdb2292036db30bf52148606e61913",
          "href": "https://downloads.wicklen.link/releases/0.6.0/manifest-0.6.0.json",
          "label": "Манифест клиента"
        },
        {
          "file": "server-manifest-0.6.0.json",
          "bytes": 38744,
          "sha256": "820553c3ca0724cca0e9afb4a09f036e00968febbfbc1838aa63ccc03bd81acb",
          "href": "https://downloads.wicklen.link/releases/0.6.0/server-manifest-0.6.0.json",
          "label": "Манифест сервера"
        },
        {
          "file": "wicklen-0.5.0-to-0.6.0-update.zip",
          "bytes": 125079,
          "sha256": "d96fa1e6f857dd577a4d357f1648f75106f2373bd429a4aeb4ebcccd9f9d8757",
          "href": "https://downloads.wicklen.link/releases/0.6.0/wicklen-0.5.0-to-0.6.0-update.zip",
          "label": "Необязательный патч настроек 0.5.0 → 0.6.0"
        },
        {
          "file": "wicklen-0.6.0-players.zip",
          "bytes": 463183154,
          "sha256": "ebe1f2e8548951707ea942a20616fb3fca17931094fd9e04771db00bcad2c087",
          "href": "https://downloads.wicklen.link/releases/0.6.0/wicklen-0.6.0-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.6.0-server.zip",
          "bytes": 497096431,
          "sha256": "094f13dae4ea114f3e320cb6812e4696935ac5098e9bda5dad09d46f7f80c24d",
          "href": "https://downloads.wicklen.link/releases/0.6.0/wicklen-0.6.0-server.zip",
          "label": "Серверный комплект"
        },
        {
          "file": "pack.lock.json",
          "bytes": 155228,
          "sha256": "978f9a019efceccd08745f9355e61ed8d0734d856ad43fac1f1d5f9e0bb98483",
          "href": "https://downloads.wicklen.link/releases/0.6.0/pack.lock.json",
          "label": "Точный состав и хеши"
        },
        {
          "file": "SHA256SUMS-0.6.0.txt",
          "bytes": 716,
          "sha256": "44edd04fdd7f9c951b0a6b1a255a5861c62d475a4802b859f48e93a8ba138d97",
          "href": "https://downloads.wicklen.link/releases/0.6.0/SHA256SUMS-0.6.0.txt",
          "label": "Контрольные суммы"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.6.0"
    },
    {
      "id": "pack-0-5-0",
      "kind": "Сборка",
      "date": "18.11.2026",
      "title": "Wicklen 0.5.0",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 124 клиентских / 169 серверных JAR.",
      "notice": "Предыдущая сборка. Клиент 0.5.0 подходит для входа на сервер 0.6.0; достаточно переподключиться.",
      "notes": [
        "Добавлены Herbcraft Core 1.1.4, Alchemy 1.1.4, Cuisine 1.1.3 и серверный Arcana Novum 4.0.12+26.3.",
        "Compat 0.1.2 возвращает карточки варки REI, пельмени и голубцы Farmer’s Delight.",
        "4152 новых строки русского перевода; исправлен формат ресурспака 97.1. Добавлены модели серверных предметов Polymer.",
        "В серверной рецептуре закреплён уже действующий лимит трёх точек дома. Chronicles остаётся 0.4.4."
      ],
      "primary": [
        {
          "file": "wicklen-0.4.5-to-0.5.0-update.zip",
          "bytes": 14668501,
          "sha256": "99a7bbd7f7d93586aed7a740947bd4924c1b01921982efea1309298b1bf5164d",
          "href": "https://downloads.wicklen.link/releases/0.5.0/wicklen-0.4.5-to-0.5.0-update.zip",
          "label": "Патч 0.4.5 → 0.5.0"
        },
        {
          "file": "wicklen-0.5.0-players.zip",
          "bytes": 463110806,
          "sha256": "28c8444b58ee29676b0f71b085339bcac3da45c1e21cef232c24e6dd105db752",
          "href": "https://downloads.wicklen.link/releases/0.5.0/wicklen-0.5.0-players.zip",
          "label": "Полный клиент"
        }
      ],
      "changes": [
        {
          "file": "wicklen-pack-compat-0.1.2.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-pack-compat/0.1.2/wicklen-pack-compat-0.1.2.jar",
          "sha512": "7f613cc2e03e8cdf4a878b1ebcde0a4f0cb9fd97d4cd03a75885e0367b8d6c55426fc445e5b746ae1ad267c5b5a154b5ff8caa6dca5ea824b406d8b07d9c1bdf",
          "side": "клиент и сервер",
          "status": "Обновлён",
          "label": "Wicklen Pack Compatibility 0.1.2",
          "note": "Заменяет wicklen-pack-compat-0.1.1.jar. Старый JAR нужно удалить."
        },
        {
          "file": "herbcraft-1.1.4.jar",
          "href": "https://cdn.modrinth.com/data/5cNyEJH1/versions/9xQKD2h4/herbcraft-1.1.4.jar",
          "sha512": "32d048d4bb89f68a207816516ca711293ce56cc6781611eb3364776917be5e32c1edad6f95bf6a86d7a6bf99820480bbd69c256ea3875b98ce031fdbc93e858b",
          "side": "клиент и сервер",
          "status": "Добавлен",
          "label": "Herbcraft Core 1.1.4"
        },
        {
          "file": "herbcraft-alchemy-1.1.4.jar",
          "href": "https://cdn.modrinth.com/data/xDJt8YY2/versions/nUfUfDJR/herbcraft-alchemy-1.1.4.jar",
          "sha512": "eea57efb7044deefc8f7ee67fec49b7e338be831f49704e17784a89f110cab4eaa2050230c65f446a840121ef0b4a26e3b1ffa84c9a2efbd6bfd0066e37a68bd",
          "side": "клиент и сервер",
          "status": "Добавлен",
          "label": "Herbcraft: Alchemy 1.1.4"
        },
        {
          "file": "herbcraft-cuisine-1.1.3.jar",
          "href": "https://cdn.modrinth.com/data/59p3worY/versions/bR6EURJj/herbcraft-cuisine-1.1.3.jar",
          "sha512": "b7731c1f803382ba91ddb4c2db12cf12565d6c1dc3c6321228212cec6b4e394f532a9b65505e021bfc5117574c0077ff3062fd5de64a426981f80ac6d7993410",
          "side": "клиент и сервер",
          "status": "Добавлен",
          "label": "Herbcraft: Cuisine 1.1.3"
        },
        {
          "file": "arcananovum-4.0.12+26.3.jar",
          "href": "https://cdn.modrinth.com/data/9J7sCd3t/versions/ytSaQglZ/arcananovum-4.0.12%2B26.3.jar",
          "sha512": "f6061c140cf676a17647e60de00ca6095f395a570e02b2a328d2a5cb5500e2537b1798f56c2cfdab6a0cb82ee59005081c2c6d89a021200468fec884ecbe547a",
          "side": "сервер",
          "status": "Добавлен",
          "label": "Arcana Novum 4.0.12+26.3"
        },
        {
          "file": "resourcepacks/ru-mods.zip",
          "label": "ru-mods — русский интерфейс модов Wicklen (26.3)",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/ru-mods-0.5.0.zip",
          "sha256": "e75d52b392a965ce8ba6ad3a4391f629eb845a5361e0f29ef8b50632c0899694",
          "side": "клиент",
          "status": "Обновлён",
          "note": "Входит в полный клиент и соответствующий патч."
        },
        {
          "file": "resourcepacks/wicklen-polymer-0.5.0.zip",
          "label": "Wicklen — модели Arcana и серверных модов",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/wicklen-polymer-0.5.0.zip",
          "sha256": "4b89cce670bc7a5d7b02cd96d73c6497f29849a5913db47c04bb28604b6732d8",
          "side": "клиент",
          "status": "Добавлен",
          "note": "Входит в полный клиент и соответствующий патч."
        },
        {
          "file": "config/EssentialCommands.properties",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.5.0/EssentialCommands.properties",
          "sha256": "c213848139ba368bb0046b6a7d8d0f26ef93c6026cd41cb01990302488263a4c",
          "bytes": 2227,
          "side": "сервер",
          "status": "Обновлён",
          "note": "Сохраняет лимит трёх точек дома."
        },
        {
          "file": "datapacks/mc-compat.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/pack-v0.5.0/wicklen-world-compat-0.5.0.zip",
          "sha256": "96b7aea479df5481959409e37fb120b442e89c1ae264c2d726b4e4a37f5bd79d",
          "bytes": 378956,
          "side": "сервер",
          "status": "Обновлён",
          "note": "Серверный языковой словарь Arcana в существующем датапаке совместимости."
        }
      ],
      "files": [
        {
          "file": "PLAYER-INSTRUCTIONS-0.5.0.md",
          "bytes": 771,
          "sha256": "5bf03dec512508a2ece87e9ca4959c6b6044ff51a68158320467750d7b985324",
          "href": "https://downloads.wicklen.link/releases/0.5.0/PLAYER-INSTRUCTIONS-0.5.0.md",
          "label": "Инструкция установки"
        },
        {
          "file": "UPDATE.json",
          "bytes": 517,
          "sha256": "7fc362925ac1006cd2c1792c98216d076d9444729af3f5ce0b0e0982bdcbc3f5",
          "href": "https://downloads.wicklen.link/releases/0.5.0/UPDATE.json",
          "label": "Что удалить и перенести"
        },
        {
          "file": "manifest-0.5.0.json",
          "bytes": 43433,
          "sha256": "ed748c96bf9bf6057823354a0a83ff8fde51c87770cc2c76b8b58be88bbf2228",
          "href": "https://downloads.wicklen.link/releases/0.5.0/manifest-0.5.0.json",
          "label": "Манифест клиента"
        },
        {
          "file": "server-manifest-0.5.0.json",
          "bytes": 38743,
          "sha256": "54ef958153f0673604c22bc3eba17e89fcf69b3162d038459cee49f7b68b7086",
          "href": "https://downloads.wicklen.link/releases/0.5.0/server-manifest-0.5.0.json",
          "label": "Манифест сервера"
        },
        {
          "file": "wicklen-0.4.5-to-0.5.0-update.zip",
          "bytes": 14668501,
          "sha256": "99a7bbd7f7d93586aed7a740947bd4924c1b01921982efea1309298b1bf5164d",
          "href": "https://downloads.wicklen.link/releases/0.5.0/wicklen-0.4.5-to-0.5.0-update.zip",
          "label": "Обновление клиента"
        },
        {
          "file": "wicklen-0.5.0-players.zip",
          "bytes": 463110806,
          "sha256": "28c8444b58ee29676b0f71b085339bcac3da45c1e21cef232c24e6dd105db752",
          "href": "https://downloads.wicklen.link/releases/0.5.0/wicklen-0.5.0-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.5.0-server.zip",
          "bytes": 497023764,
          "sha256": "13bef9473efe6307f97001f78655c27cd3dd143d469a4ba68f85760d09b4868f",
          "href": "https://downloads.wicklen.link/releases/0.5.0/wicklen-0.5.0-server.zip",
          "label": "Серверный комплект"
        },
        {
          "file": "pack.lock.json",
          "bytes": 155229,
          "sha256": "f87d11782b46267e5b41898b254417cfe1acbd6f3afe02913566f4a485d24051",
          "href": "https://downloads.wicklen.link/releases/0.5.0/pack.lock.json",
          "label": "Точный состав и хеши"
        },
        {
          "file": "SHA256SUMS-0.5.0.txt",
          "bytes": 716,
          "sha256": "1e2e25de1954573411aa7d62c84c33e41a58b72cfa2b788c9f37e124c07efc68",
          "href": "https://downloads.wicklen.link/releases/0.5.0/SHA256SUMS-0.5.0.txt",
          "label": "Контрольные суммы"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.5.0"
    },
    {
      "id": "compat-0-1-2",
      "kind": "Наш компонент",
      "date": "18.11.2026",
      "title": "Wicklen Pack Compat 0.1.2",
      "description": "Исправления REI и совместимости модов для Minecraft 26.3.",
      "notes": [
        "Восстановлены серверные карточки варки: ванильные зелья и рецепты установленных модов.",
        "В REI снова отображаются пельмени и голубцы Farmer’s Delight.",
        "Сохранены защита Mochi на плече и исправление проверки генерации мира.",
        "Для всех исправлений поставьте JAR на клиент и сервер, удалив прежний Compat."
      ],
      "primary": [
        {
          "file": "wicklen-pack-compat-0.1.2.jar",
          "bytes": 7474,
          "sha256": "39869d5ac1cadd782fa43b3acd180a3919edb688a9393bf7d6842f6f51fe462b",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-pack-compat/0.1.2/wicklen-pack-compat-0.1.2.jar",
          "label": "Compat 0.1.2 · JAR"
        }
      ],
      "changes": [],
      "files": [
        {
          "file": "wicklen-pack-compat-0.1.2.jar",
          "bytes": 7474,
          "sha256": "39869d5ac1cadd782fa43b3acd180a3919edb688a9393bf7d6842f6f51fe462b",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-pack-compat/0.1.2/wicklen-pack-compat-0.1.2.jar",
          "label": "Compat 0.1.2 · JAR"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/compat-v0.1.2"
    },
    {
      "id": "resources-0-5-0",
      "kind": "Ресурспаки и перевод",
      "date": "18.11.2026",
      "title": "Ресурсы Wicklen 0.5.0",
      "description": "Русский перевод и модели серверных предметов доступны отдельно и входят в новую сборку.",
      "notes": [
        "Русский ресурспак: 13 029 строк в 79 пространствах имён, включая 4152 новые строки Herbcraft и Arcana.",
        "Включите Wicklen Polymer в наборах ресурсов, а ru-mods поставьте выше него.",
        "Отдельный языковой датапак Arcana нужен только серверу. В серверном комплекте 0.5.0 его строки уже включены в mc-compat.zip.",
        "Встроенная книга и большая часть лора Arcana остаются английскими; это ограничение исходного мода."
      ],
      "primary": [
        {
          "file": "ru-mods-0.5.0.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/ru-mods-0.5.0.zip",
          "bytes": 1886770,
          "sha256": "e75d52b392a965ce8ba6ad3a4391f629eb845a5361e0f29ef8b50632c0899694",
          "label": "Русский ресурспак"
        },
        {
          "file": "wicklen-polymer-0.5.0.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/wicklen-polymer-0.5.0.zip",
          "bytes": 7577936,
          "sha256": "4b89cce670bc7a5d7b02cd96d73c6497f29849a5913db47c04bb28604b6732d8",
          "label": "Модели и текстуры Polymer"
        }
      ],
      "changes": [],
      "files": [
        {
          "file": "SHA256SUMS-resources-0.5.0.txt",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/SHA256SUMS-resources-0.5.0.txt",
          "bytes": 269,
          "sha256": "6b63fc5e96bd02708ea8173d2dad65c5f28c7aeef192a6565327438c99c3b5a4",
          "label": "Контрольные суммы"
        },
        {
          "file": "arcana-server-ru-0.5.0.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/arcana-server-ru-0.5.0.zip",
          "bytes": 366026,
          "sha256": "0f1bf209cb01d4caa0b098df4fb859f4950582a45f3f98fd2cbad6cd3bc38e3d",
          "label": "Языковой датапак Arcana"
        },
        {
          "file": "resources-0.5.0.json",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/resources-0.5.0.json",
          "bytes": 746,
          "sha256": "b8e9ad49f386f899085067f3b8d038ee69448a79fe8c3ebc64d16f151810dcf6",
          "label": "resources-0.5.0.json"
        },
        {
          "file": "ru-mods-0.5.0.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/ru-mods-0.5.0.zip",
          "bytes": 1886770,
          "sha256": "e75d52b392a965ce8ba6ad3a4391f629eb845a5361e0f29ef8b50632c0899694",
          "label": "Русский ресурспак"
        },
        {
          "file": "wicklen-polymer-0.5.0.zip",
          "href": "https://github.com/Wicklen-MC/wicklen-releases/releases/download/resources-v0.5.0/wicklen-polymer-0.5.0.zip",
          "bytes": 7577936,
          "sha256": "4b89cce670bc7a5d7b02cd96d73c6497f29849a5913db47c04bb28604b6732d8",
          "label": "Модели и текстуры Polymer"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/resources-v0.5.0"
    },
    {
      "id": "chronicles-0-4-4",
      "kind": "Наш мод",
      "date": "18.11.2026",
      "title": "Wicklen: Chronicles 0.4.4",
      "description": "Дух, дневник, наблюдения и карта. В сборке 0.5.0 используется уже выпущенный JAR без изменений.",
      "notes": [
        "Сохранена бесшумность духа при установленном Presence Footsteps.",
        "Инструкции по дневнику и испытаниям — на странице Chronicles."
      ],
      "primary": [
        {
          "file": "wicklen-chronicles-0.4.4.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-chronicles/0.4.4/wicklen-chronicles-0.4.4.jar",
          "sha512": "6903ea1b4bc3803515b1913949746ee0dbf5c7da634c5dce8aca6822b9c522290140adf98fafa2531919d18ae82e0542446b0fd88eb82071eb847e9192dfa898",
          "bytes": 833061,
          "label": "Chronicles 0.4.4 · JAR"
        }
      ],
      "changes": [],
      "files": [
        {
          "file": "wicklen-chronicles-0.4.4.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-chronicles/0.4.4/wicklen-chronicles-0.4.4.jar",
          "sha512": "6903ea1b4bc3803515b1913949746ee0dbf5c7da634c5dce8aca6822b9c522290140adf98fafa2531919d18ae82e0542446b0fd88eb82071eb847e9192dfa898",
          "bytes": 833061,
          "label": "Chronicles 0.4.4 · JAR"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-chronicles/releases/tag/v0.4.4"
    },
    {
      "id": "pack-0-4-5",
      "kind": "Сборка",
      "date": "18.11.2026",
      "title": "Wicklen 0.4.5",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 121 клиентских / 165 серверных JAR.",
      "notice": "Предыдущая сборка. Для новой установки используйте 0.6.0; клиент 0.5.0 тоже совместим с текущим сервером.",
      "notes": [
        "Compat обновлён до 0.1.1: защита Mochi на плече от урона владельца и перехвата прицела.",
        "Chronicles 0.4.4 сохраняет бесшумность духа с Presence Footsteps."
      ],
      "primary": [
        {
          "file": "wicklen-0.4.4-to-0.4.5-update.zip",
          "bytes": 881942,
          "sha256": "1577d4164ff94b02cdcb8d18314d10e0e77cfdfa8776de2c0dd591d8b08a30ec",
          "href": "https://downloads.wicklen.link/releases/0.4.5/wicklen-0.4.4-to-0.4.5-update.zip",
          "label": "Патч 0.4.4 → 0.4.5"
        },
        {
          "file": "wicklen-0.4.5-players.zip",
          "bytes": 449776390,
          "sha256": "cc715a6d8aea1e1ceb8a4c88aa670afeff362c7e9aadaeeb97f44581e07b35b4",
          "href": "https://downloads.wicklen.link/releases/0.4.5/wicklen-0.4.5-players.zip",
          "label": "Полный клиент"
        }
      ],
      "changes": [
        {
          "file": "wicklen-chronicles-0.4.4.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-chronicles/0.4.4/wicklen-chronicles-0.4.4.jar",
          "sha512": "6903ea1b4bc3803515b1913949746ee0dbf5c7da634c5dce8aca6822b9c522290140adf98fafa2531919d18ae82e0542446b0fd88eb82071eb847e9192dfa898",
          "side": "клиент и сервер",
          "status": "Обновлён",
          "label": "Wicklen: Chronicles 0.4.4",
          "note": "Заменяет wicklen-chronicles-0.4.3.jar. Старый JAR нужно удалить."
        },
        {
          "file": "wicklen-pack-compat-0.1.1.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-pack-compat/0.1.1/wicklen-pack-compat-0.1.1.jar",
          "sha512": "4c3f72c8faa405a4748ed061af36eb91c688a750f7212aa200cbf24108ffb7c4f7ad71c9afc0031ef1139b461bb400c71bef1a759462fdf0b58da7dcda9e7f08",
          "side": "клиент и сервер",
          "status": "Обновлён",
          "label": "Wicklen Pack Compatibility 0.1.1",
          "note": "Заменяет wicklen-pack-compat-0.1.0.jar. Старый JAR нужно удалить."
        }
      ],
      "files": [
        {
          "file": "PLAYER-INSTRUCTIONS-0.4.5.md",
          "bytes": 608,
          "sha256": "bbfee840e72e7a47aef69dca61d4be8a04fbb2f1dffbf60049262ceaf6bb4f80",
          "href": "https://downloads.wicklen.link/releases/0.4.5/PLAYER-INSTRUCTIONS-0.4.5.md",
          "label": "Инструкция установки"
        },
        {
          "file": "SHA256SUMS-0.4.5.txt",
          "bytes": 716,
          "sha256": "d686acd65040eb18123b41df68d4f57230a87865837ee111a3baaad42230099a",
          "href": "https://downloads.wicklen.link/releases/0.4.5/SHA256SUMS-0.4.5.txt",
          "label": "Контрольные суммы"
        },
        {
          "file": "UPDATE.json",
          "bytes": 402,
          "sha256": "1faa8bf481722373b19319b105ff2eb1da685bf46c2d8b84d1d4ff55494a162a",
          "href": "https://downloads.wicklen.link/releases/0.4.5/UPDATE.json",
          "label": "Что удалить и перенести"
        },
        {
          "file": "manifest-0.4.5.json",
          "bytes": 42052,
          "sha256": "4b6285918565fb8fc84a76f54c9eba92805e1132c3a3b59ccb9fbe3fcfe5388e",
          "href": "https://downloads.wicklen.link/releases/0.4.5/manifest-0.4.5.json",
          "label": "Манифест клиента"
        },
        {
          "file": "pack.lock.json",
          "bytes": 151697,
          "sha256": "3579e2d88e83a2a397f7ea3ea07b4e4a8d6dac7c08e8c1356708d567467a0fde",
          "href": "https://downloads.wicklen.link/releases/0.4.5/pack.lock.json",
          "label": "Точный состав и хеши"
        },
        {
          "file": "server-manifest-0.4.5.json",
          "bytes": 37986,
          "sha256": "c41de30aca10cf22df6ede3fe2786c80dd742c02e6bb338e48fc2f3c629c873f",
          "href": "https://downloads.wicklen.link/releases/0.4.5/server-manifest-0.4.5.json",
          "label": "Манифест сервера"
        },
        {
          "file": "wicklen-0.4.4-to-0.4.5-update.zip",
          "bytes": 881942,
          "sha256": "1577d4164ff94b02cdcb8d18314d10e0e77cfdfa8776de2c0dd591d8b08a30ec",
          "href": "https://downloads.wicklen.link/releases/0.4.5/wicklen-0.4.4-to-0.4.5-update.zip",
          "label": "Обновление клиента"
        },
        {
          "file": "wicklen-0.4.5-players.zip",
          "bytes": 449776390,
          "sha256": "cc715a6d8aea1e1ceb8a4c88aa670afeff362c7e9aadaeeb97f44581e07b35b4",
          "href": "https://downloads.wicklen.link/releases/0.4.5/wicklen-0.4.5-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.4.5-server.zip",
          "bytes": 482873860,
          "sha256": "6e5c860757c4ed166c6f128fa05782a0edf17d82bddb7e058f29062b7560b1d0",
          "href": "https://downloads.wicklen.link/releases/0.4.5/wicklen-0.4.5-server.zip",
          "label": "Серверный комплект"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.4.5"
    },
    {
      "id": "pack-0-4-4",
      "kind": "Сборка",
      "date": "07.11.2026",
      "title": "Wicklen 0.4.4",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 121 клиентских / 165 серверных JAR.",
      "notice": "",
      "notes": [
        "Chronicles обновлён с 0.4.2 до 0.4.3: тканевый странник, ванильная справка и ползунки положения реплик."
      ],
      "primary": [
        {
          "file": "wicklen-0.4.3-to-0.4.4-update.zip",
          "bytes": 875535,
          "sha256": "e856347a3f539c6f125f6145e51a9d71c95aefa3d8c3ff40ac0eb94f3feb511e",
          "href": "https://downloads.wicklen.link/releases/0.4.4/wicklen-0.4.3-to-0.4.4-update.zip",
          "label": "Патч 0.4.3 → 0.4.4"
        },
        {
          "file": "wicklen-0.4.4-players.zip",
          "bytes": 449773521,
          "sha256": "2e55b5c608215b6bb61bd2471f27dd4c7e777b4d66f34cb5c5c64a238271b871",
          "href": "https://downloads.wicklen.link/releases/0.4.4/wicklen-0.4.4-players.zip",
          "label": "Полный клиент"
        }
      ],
      "changes": [
        {
          "file": "wicklen-chronicles-0.4.3.jar",
          "href": "https://downloads.wicklen.link/releases/components/wicklen-chronicles/0.4.3/wicklen-chronicles-0.4.3.jar",
          "sha512": "0f888806e64d07d9c312c6a76c1661b541b02c0b93c5151554675ca26b8bcc871b8d6bc795f4ef7ee0ff37cb58cf82d565ebd70b4c7f54389450f09b163c896d",
          "side": "клиент и сервер",
          "status": "Обновлён",
          "label": "Wicklen: Chronicles 0.4.3",
          "note": "Заменяет wicklen-chronicles-0.4.2.jar. Старый JAR нужно удалить."
        }
      ],
      "files": [
        {
          "file": "PLAYER-INSTRUCTIONS-0.4.4.md",
          "bytes": 608,
          "sha256": "4ac1445a2d5bf746635fd578b9ae6ffa4a6b1b151629304e26a8298c52459d35",
          "href": "https://downloads.wicklen.link/releases/0.4.4/PLAYER-INSTRUCTIONS-0.4.4.md",
          "label": "Инструкция установки"
        },
        {
          "file": "SHA256SUMS-0.4.4.txt",
          "bytes": 716,
          "sha256": "908c21c81aa0043c462054869e54a65da71407c31392c816d7320182c76ff44d",
          "href": "https://downloads.wicklen.link/releases/0.4.4/SHA256SUMS-0.4.4.txt",
          "label": "Контрольные суммы"
        },
        {
          "file": "UPDATE.json",
          "bytes": 323,
          "sha256": "dd726c3a904d439d4cf08dd6354442abb3996111cd40aae0d664599196de9e45",
          "href": "https://downloads.wicklen.link/releases/0.4.4/UPDATE.json",
          "label": "Что удалить и перенести"
        },
        {
          "file": "manifest-0.4.4.json",
          "bytes": 42052,
          "sha256": "1a005c413c203f1ed3711d829eaf2925cad80101ac6f8806850ca1aa69b72459",
          "href": "https://downloads.wicklen.link/releases/0.4.4/manifest-0.4.4.json",
          "label": "Манифест клиента"
        },
        {
          "file": "pack.lock.json",
          "bytes": 151637,
          "sha256": "786f162a6da9f209601061c7817128a45f199b66004ff6ef3fc244fc80317f69",
          "href": "https://downloads.wicklen.link/releases/0.4.4/pack.lock.json",
          "label": "Точный состав и хеши"
        },
        {
          "file": "server-manifest-0.4.4.json",
          "bytes": 38001,
          "sha256": "15b30c926843dd47519e5ccec1cb72e4f1aecc1c97529d1bb1aa977f56dfd252",
          "href": "https://downloads.wicklen.link/releases/0.4.4/server-manifest-0.4.4.json",
          "label": "Манифест сервера"
        },
        {
          "file": "wicklen-0.4.3-to-0.4.4-update.zip",
          "bytes": 875535,
          "sha256": "e856347a3f539c6f125f6145e51a9d71c95aefa3d8c3ff40ac0eb94f3feb511e",
          "href": "https://downloads.wicklen.link/releases/0.4.4/wicklen-0.4.3-to-0.4.4-update.zip",
          "label": "Обновление клиента"
        },
        {
          "file": "wicklen-0.4.4-players.zip",
          "bytes": 449773521,
          "sha256": "2e55b5c608215b6bb61bd2471f27dd4c7e777b4d66f34cb5c5c64a238271b871",
          "href": "https://downloads.wicklen.link/releases/0.4.4/wicklen-0.4.4-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.4.4-server.zip",
          "bytes": 482870991,
          "sha256": "23dbe9532d9610193a6792c36ad65c2da78ecaf6a9f1c3bc5d4136510aa867e0",
          "href": "https://downloads.wicklen.link/releases/0.4.4/wicklen-0.4.4-server.zip",
          "label": "Серверный комплект"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.4.4"
    },
    {
      "id": "pack-0-4-3",
      "kind": "Сборка",
      "date": "07.11.2026",
      "title": "Wicklen 0.4.3",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 121 клиентских / 165 серверных JAR.",
      "notice": "",
      "notes": [
        "Воспроизводимая серверная и клиентская упаковка. Русский пак дополнен переводом OreGrowth.",
        "Набор модов сохранён относительно 0.4.2."
      ],
      "primary": [
        {
          "file": "wicklen-0.4.2-to-0.4.3-update.zip",
          "bytes": 1328227,
          "sha256": "fab7e152d5374416de772bd8bf3d9144adb22680707705e7be7835a43b47ab13",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.2-to-0.4.3-update.zip",
          "label": "Патч 0.4.2 → 0.4.3"
        },
        {
          "file": "wicklen-0.4.3-players.zip",
          "bytes": 449756730,
          "sha256": "e6adc96f9c505b3757538fcf7f92185556ed08bfd1feca864a7ff7bffdbcf2e8",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.3-players.zip",
          "label": "Полный клиент"
        }
      ],
      "changes": [
        {
          "file": "resourcepacks/ru-mods.zip",
          "label": "ru-mods — русский интерфейс модов Wicklen (26.3)",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.3-players.zip",
          "sha256": "b70c59d09f526d6faefa6d7cc15faf7025e2368150ac9321750e77cdecb4bdde",
          "side": "клиент",
          "status": "Обновлён",
          "note": "Входит в полный клиент и соответствующий патч."
        }
      ],
      "files": [
        {
          "file": "PLAYER-INSTRUCTIONS-0.4.3.md",
          "bytes": 608,
          "sha256": "d3ff99c9c4543aabe4984759435a985ee697028ea68005d04ff8b3055cc6e97d",
          "href": "https://downloads.wicklen.link/releases/0.4.3/PLAYER-INSTRUCTIONS-0.4.3.md",
          "label": "Инструкция установки"
        },
        {
          "file": "SHA256SUMS-0.4.3.txt",
          "bytes": 716,
          "sha256": "4af83d851196edc4fc0695bf1bc29613551bc6e2ea89391b1f7680c2aa9632c6",
          "href": "https://downloads.wicklen.link/releases/0.4.3/SHA256SUMS-0.4.3.txt",
          "label": "Контрольные суммы"
        },
        {
          "file": "UPDATE.json",
          "bytes": 277,
          "sha256": "e2166874c59c25dd62666380bd23eb45645993ea6cd820ad88a5676f83644c38",
          "href": "https://downloads.wicklen.link/releases/0.4.3/UPDATE.json",
          "label": "Что удалить и перенести"
        },
        {
          "file": "manifest-0.4.3.json",
          "bytes": 42052,
          "sha256": "d63a3822c7e80aa98de57929d79bb701dd3eccdbccebce7bac6e7e5fcccc4265",
          "href": "https://downloads.wicklen.link/releases/0.4.3/manifest-0.4.3.json",
          "label": "Манифест клиента"
        },
        {
          "file": "pack.lock.json",
          "bytes": 151638,
          "sha256": "cd499423a7b51636668fa21942aa652cb014d110778fcd9579e7fc8c46c248fe",
          "href": "https://downloads.wicklen.link/releases/0.4.3/pack.lock.json",
          "label": "Точный состав и хеши"
        },
        {
          "file": "server-manifest-0.4.3.json",
          "bytes": 38001,
          "sha256": "ab538bc74ddafbd93216eb7049a90e22c56f844297bcf8cfe27dff8f8fe36d85",
          "href": "https://downloads.wicklen.link/releases/0.4.3/server-manifest-0.4.3.json",
          "label": "Манифест сервера"
        },
        {
          "file": "wicklen-0.4.2-to-0.4.3-update.zip",
          "bytes": 1328227,
          "sha256": "fab7e152d5374416de772bd8bf3d9144adb22680707705e7be7835a43b47ab13",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.2-to-0.4.3-update.zip",
          "label": "Обновление клиента"
        },
        {
          "file": "wicklen-0.4.3-players.zip",
          "bytes": 449756730,
          "sha256": "e6adc96f9c505b3757538fcf7f92185556ed08bfd1feca864a7ff7bffdbcf2e8",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.3-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.4.3-server.zip",
          "bytes": 482854200,
          "sha256": "e4cf18afa1bf17bce1005bee547086d2d773f224b4c8739c83be09b61568fb39",
          "href": "https://downloads.wicklen.link/releases/0.4.3/wicklen-0.4.3-server.zip",
          "label": "Серверный комплект"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.4.3"
    },
    {
      "id": "pack-0-4-2",
      "kind": "Сборка",
      "date": "06.11.2026",
      "title": "Wicklen 0.4.2",
      "description": "Minecraft 26.3 · Fabric 0.20.1 · Java 25 · 121 клиентских / 165 серверных JAR.",
      "notice": "",
      "notes": [
        "Первый сохранённый состав этой ветки: 165 серверных и 121 клиентский JAR.",
        "Исторические имена архивов сохранены; файлы не пересобирались."
      ],
      "primary": [
        {
          "file": "wicklen-live-0.4.2-players.zip",
          "bytes": 449758055,
          "sha256": "ebe4c3d91857a47f60da887ca065d94b35464c90f48cae9372056b0fa25f977b",
          "href": "https://downloads.wicklen.link/releases/0.4.2/wicklen-live-0.4.2-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.4.1-to-0.4.2-update.zip",
          "bytes": 1016476,
          "sha256": "cea50eb3ec9b28ba7857512ec2003570007b8c2de13d867d33ab7c1253415f6c",
          "href": "https://downloads.wicklen.link/releases/0.4.2/wicklen-0.4.1-to-0.4.2-update.zip",
          "label": "Патч 0.4.1 → 0.4.2"
        }
      ],
      "changes": [],
      "files": [
        {
          "file": "wicklen-live-0.4.2-players.zip",
          "bytes": 449758055,
          "sha256": "ebe4c3d91857a47f60da887ca065d94b35464c90f48cae9372056b0fa25f977b",
          "href": "https://downloads.wicklen.link/releases/0.4.2/wicklen-live-0.4.2-players.zip",
          "label": "Полный клиент"
        },
        {
          "file": "wicklen-0.4.1-to-0.4.2-update.zip",
          "bytes": 1016476,
          "sha256": "cea50eb3ec9b28ba7857512ec2003570007b8c2de13d867d33ab7c1253415f6c",
          "href": "https://downloads.wicklen.link/releases/0.4.2/wicklen-0.4.1-to-0.4.2-update.zip",
          "label": "Обновление клиента"
        },
        {
          "file": "manifest-0.4.2.json",
          "bytes": 43310,
          "sha256": "e4a78c716c3b61e1d1634e81190fcacf850631ec55449466212023f54c54c0bf",
          "href": "https://downloads.wicklen.link/releases/0.4.2/manifest-0.4.2.json",
          "label": "Манифест клиента"
        },
        {
          "file": "PLAYER-INSTRUCTIONS-0.4.2.md",
          "bytes": 2731,
          "sha256": "bb194a828f23b80184ba58e567b00e0572d195b9e4deea11d13cd31b4bebae34",
          "href": "https://downloads.wicklen.link/releases/0.4.2/PLAYER-INSTRUCTIONS-0.4.2.md",
          "label": "Инструкция установки"
        },
        {
          "file": "SHA256SUMS-0.4.2.txt",
          "href": "https://downloads.wicklen.link/releases/0.4.2/SHA256SUMS-0.4.2.txt",
          "bytes": 378,
          "sha256": "a77ab481e95d885b7b0bcad36d54f4dda485f87b73d3defd99a8b0b1456ad9ca",
          "label": "Контрольные суммы"
        }
      ],
      "releaseUrl": "https://github.com/Wicklen-MC/wicklen-releases/releases/tag/pack-v0.4.2"
    }
  ]
};
