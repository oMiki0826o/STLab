#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File: check_static.py
Modification: 2026-10-10 - 檢查原生靜態網頁的資源路徑、重複 ID 與基本內容。
"""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
# Keep this legacy checker scoped to the original static snapshot. Next.js
# writes its own generated HTML/assets to out/, which has a different layout.
PAGES = [
    ROOT / 'index.html',
    ROOT / 'schedule-studio' / 'index.html',
    ROOT / 'table-studio' / 'index.html',
]
EXPORTED_ROUTES = []
NEXT_ROUTES = [
    "index.html",
    "schedule/index.html",
    "table/index.html",
    "exam/index.html",
    "404.html",
]


# ── HTML 結構檢查 ──
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.assets = []
        self.language = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        identifier = attributes.get('id')
        if identifier:
            if identifier in self.ids:
                self.duplicates.append(identifier)
            self.ids.add(identifier)
        if tag == 'html':
            self.language = bool(attributes.get('lang'))
        for name in ('src', 'href'):
            value = attributes.get(name)
            if value:
                self.assets.append(value)


def main():
    errors = []
    for page in PAGES:
        doc = Inspector()
        doc.feed(page.read_text(encoding='utf-8'))
        if not doc.language:
            errors.append(f'{page.relative_to(ROOT)}: missing lang')
        for identifier in doc.duplicates:
            errors.append(f'{page.relative_to(ROOT)}: duplicate id {identifier}')
        for link in doc.assets:
            if link.startswith(('http:', 'https:', 'mailto:', '#', 'data:')):
                continue
            parts = urlsplit(link)
            if parts.path in ('', './'):
                continue
            target = (page.parent / unquote(parts.path)).resolve()
            if not target.is_relative_to(ROOT.resolve()) or not target.exists():
                errors.append(f'{page.relative_to(ROOT)}: broken path {link}')
        print(f'CHECK {page.relative_to(ROOT)}: {len(doc.ids)} elements with ID')
    if errors:
        print('\n'.join(f'ERROR {error}' for error in errors))
        raise SystemExit(1)
    exported_root = ROOT / 'out'
    missing = [route for route in EXPORTED_ROUTES if not (exported_root / route).exists()]
    if missing:
        raise SystemExit('ERROR missing exported routes: ' + ', '.join(missing))
    missing_next = [route for route in NEXT_ROUTES if not (exported_root / route).exists()]
    if missing_next:
        raise SystemExit('ERROR missing Next.js routes: ' + ', '.join(missing_next))
    print(f'CHECK out/: {len(NEXT_ROUTES)} Next.js routes present')
    print(f'OK: {len(PAGES)} static HTML pages validated')


if __name__ == '__main__':
    main()
