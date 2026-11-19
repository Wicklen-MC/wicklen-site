"""Test access to rendered pages and public assets without building into the repo."""

import json
from functools import lru_cache

from wicklen_site import build
from wicklen_site.paths import CONTENT_SCRIPTS, ROOT, source_files

PUBLIC = ROOT / "public"
CONTENT = ROOT / "content"


@lru_cache(maxsize=1)
def rendered():
    return build.render(source_files())


def text(name):
    if name in rendered():
        return rendered()[name]
    return source_files()[name].read_text(encoding="utf-8")


def data(name):
    if name in CONTENT_SCRIPTS:
        return json.loads(
            (CONTENT / CONTENT_SCRIPTS[name][0]).read_text(encoding="utf-8")
        )
    value = text(name)
    return json.loads(value[value.index("{") :].strip().removesuffix(";"))
