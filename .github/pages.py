"""Minimal check for a static site: every page parses and every local link, script, style and image it names exists."""
import os
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.found.append(value)


problems, pages = [], 0
for folder, names, files in os.walk(ROOT):
    names[:] = [name for name in names if not name.startswith(".")]
    for name in files:
        if name.endswith(".html"):
            pages += 1
            path = os.path.join(folder, name)
            parser = Links()
            parser.feed(open(path, encoding="utf-8").read())
            for link in parser.found:
                parts = urlparse(link)
                if parts.scheme or parts.netloc or not parts.path:
                    continue
                target = os.path.join(ROOT, parts.path.lstrip("/")) if parts.path.startswith("/") else os.path.join(folder, unquote(parts.path))
                if not (os.path.isfile(target) or os.path.isfile(os.path.join(target, "index.html"))):
                    problems.append(f"{os.path.relpath(path, ROOT)} links to {link}, which does not exist")
if not os.path.isfile(os.path.join(ROOT, "index.html")):
    problems.append("index.html is missing")
print("\n".join(problems) or f"{pages} pages pass")
sys.exit(1 if problems else 0)
