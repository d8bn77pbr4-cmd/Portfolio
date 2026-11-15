#!/usr/bin/env python3
"""Erzeugt ohne-youtube.html aus index.html: die Fassung ohne die YouTube-Reihe.

Regeln in index.html:
  <!-- nur-mit-youtube -->…<!-- /nur-mit-youtube -->   wird in der Fassung ohne YouTube entfernt (Zeilenblock oder inline)
  /* nur-mit-youtube */…/* /nur-mit-youtube */         dasselbe für CSS
  <!--ohne-youtube:…-->                                wird nur in der Fassung ohne YouTube sichtbar (Ersatz für entfernte Teile)
Außerdem: Seitenzahlen der Projektkarten (S. n) neu zählen, Projektzahl im Hinweis anpassen, eigener Online-Link.
Danach prüft das Skript, dass nichts von YouTube übrig ist und alle Sprungziele (#…) existieren.
Aufruf: python3 tools/variant.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MIT = ("Online mit Song und Videos", "https://claude.ai/artifact/Jn33i7LNbS8sLHWa1Dg8Mx")
OHNE = ("Online mit Song", "https://claude.ai/artifact/EbLVkFa3xryE3ffkJ2T1EQ")


def check_anchors(html, name):
    ids = set(re.findall(r'\bid="([^"]+)"', html))
    # Platzhalter in Skript-Vorlagen (${…}) sind keine echten Links
    missing = sorted({h for h in re.findall(r'href="#([^"]*)"', html) if h and "$" not in h and h not in ids})
    if missing:
        sys.exit(f"{name}: Sprungziele ohne Ansicht: {missing}")


src = (ROOT / "index.html").read_text(encoding="utf-8")
check_anchors(src, "index.html")

out = re.sub(r"^[ \t]*<!-- nur-mit-youtube -->\n.*?^[ \t]*<!-- /nur-mit-youtube -->\n", "", src, flags=re.S | re.M)
out = re.sub(r"<!-- nur-mit-youtube -->.*?<!-- /nur-mit-youtube -->", "", out, flags=re.S)
out = re.sub(r"[ \t]*/\* nur-mit-youtube \*/.*?/\* /nur-mit-youtube \*/[ \t]*\n?", "", out, flags=re.S)  # CSS-Blöcke
out = re.sub(r"<!--ohne-youtube:(.*?)-->", r"\1", out, flags=re.S)

pages = iter(range(2, 1000))  # Seite 1 = Startseite mit allen Karten, danach je Karte eine Seite in Kartenreihenfolge
out = re.sub(r'<span class="pg">S\. \d+</span>', lambda m: f'<span class="pg">S. {next(pages)}</span>', out)
projects = len(re.findall(r'<section class="view project"', out))
out = re.sub(r"\d+ eigene Projekte", f"{projects} eigene Projekte", out)
out = out.replace(MIT[0], OHNE[0]).replace(MIT[1], OHNE[1]).replace(MIT[1].removeprefix("https://"), OHNE[1].removeprefix("https://"))
out = out.replace("<!doctype html>\n", "<!doctype html>\n<!-- Automatisch erzeugt aus index.html mit tools/variant.py, nicht von Hand ändern. -->\n", 1)

for gone in (r"youtube", r"capcut", r"davinci", r"tshirtalshose", r"vol8", re.escape(MIT[1])):
    if re.search(gone, out, flags=re.I):
        sys.exit(f"ohne-youtube.html: enthält noch „{gone}“")
cards = len(re.findall(r'<a class="card', out))
if len(re.findall(r'class="pg"', out)) != cards or cards != projects + 2:
    sys.exit(f"ohne-youtube.html: {cards} Karten, {projects} Projekte, Seitenzahlen passen nicht zusammen (erwartet: Projekte + Über mich + Kontakt)")
check_anchors(out, "ohne-youtube.html")

(ROOT / "ohne-youtube.html").write_text(out, encoding="utf-8")
print(f"ohne-youtube.html: {projects} Projekte")
