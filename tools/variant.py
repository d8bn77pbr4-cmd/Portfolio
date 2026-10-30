#!/usr/bin/env python3
"""Erzeugt ohne-youtube.html aus index.html: die Fassung ohne die YouTube-Reihe.

Entfernt alles zwischen <!-- nur-mit-youtube --> und <!-- /nur-mit-youtube -->, nummeriert die Stationen,
die Projektliste und die Seitenzahlen neu, passt die Projektzahl im Hinweis oben an und setzt den Link
zur eigenen Online-Fassung. Aufruf: python3 tools/variant.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
MIT = ("Online mit Song und Videos", "https://claude.ai/artifact/Jn33i7LNbS8sLHWa1Dg8Mx")
OHNE = ("Online mit Song", "https://claude.ai/artifact/EbLVkFa3xryE3ffkJ2T1EQ")

src = (ROOT / "index.html").read_text(encoding="utf-8")
out = re.sub(r"^[ \t]*<!-- nur-mit-youtube -->\n.*?^[ \t]*<!-- /nur-mit-youtube -->\n", "", src, flags=re.S | re.M)
out = re.sub(r"<!-- nur-mit-youtube -->.*?<!-- /nur-mit-youtube -->", "", out, flags=re.S)


def renumber(pattern, fmt, text, start=1):
    counter = iter(range(start, 1000))
    return re.sub(pattern, lambda m: fmt.format(next(counter)), text)


out = renumber(r'<span class="node" aria-hidden="true">\d+</span>', '<span class="node" aria-hidden="true">{}</span>', out)
out = renumber(r'data-label="\d+ · ', 'data-label="{} · ', out)
out = renumber(r"<!-- \d+ -->", "<!-- {} -->", out)
out = renumber(r'<span class="n">\d+</span>', '<span class="n">{}</span>', out)
out = renumber(r'<span class="pg">S\. \d+</span>', '<span class="pg">S. {}</span>', out, start=2)
stations = out.count('<article class="station')
out = re.sub(r"\d+ eigene Projekte", f"{stations} eigene Projekte", out)
out = out.replace(MIT[0], OHNE[0]).replace(MIT[1], OHNE[1]).replace(MIT[1].removeprefix("https://"), OHNE[1].removeprefix("https://"))
out = out.replace("<!doctype html>\n", "<!doctype html>\n<!-- Automatisch erzeugt aus index.html mit tools/variant.py, nicht von Hand ändern. -->\n", 1)

for gone in (r'<a[^>]*href="#tshirtalshose"', r'id="tshirtalshose"', r"youtube\.com", "CapCut", re.escape(MIT[1])):
    assert not re.search(gone, out), gone
(ROOT / "ohne-youtube.html").write_text(out, encoding="utf-8")
print(f"ohne-youtube.html: {stations} Projekte")
