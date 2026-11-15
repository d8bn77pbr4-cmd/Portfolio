# Portfolio Tjark Reichart – Hinweise für Änderungen

Universelles Portfolio von Tjark Reichart, auf Deutsch: zeigt alle bisher selbst gemachten Projekte mit Idee, Umsetzung und Gelerntem.
Es ist **keine Bewerbung** und soll an jeden geschickt werden können, ohne etwas zu ändern. Eine einzige statische Seite ohne Build-Werkzeuge.
Titel der Seite: „Portfolio Tjark Reichart“. Es gibt **zwei Fassungen: mit und ohne YouTube** (die Video-Reihe TSHIRTALSHOSE).

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | **Die einzige Quelle** (Fassung mit YouTube). Inhalt, CSS und JS in einer Datei. Alle Änderungen hier. |
| `ohne-youtube.html` | Fassung ohne YouTube, **automatisch erzeugt** von `tools/variant.py`, nie von Hand ändern |
| `tools/variant.py` | Entfernt `<!-- nur-mit-youtube -->…<!-- /nur-mit-youtube -->` (auch inline) und CSS `/* nur-mit-youtube */…/* /nur-mit-youtube */`, macht `<!--ohne-youtube:…-->` sichtbar, zählt die Seitenzahlen `S. n` neu, passt „7 eigene Projekte“ an, setzt den eigenen Online-Link und prüft Sprungziele und YouTube-Reste |
| `tools/build-all.sh` | **Nach jeder Änderung ausführen:** Variante, beide Artifact-Dateien, beide PDFs |
| `tools/build-pdf.js` | Erzeugt beide PDFs (A4 quer, dunkel, jede Ansicht eine Seite; zu hohe Seiten werden über `zoom` auf `.fit` verkleinert) |
| `tools/build-artifact.sh` | Erzeugt `build/artifact.html` und `build/artifact-ohne-youtube.html` (entfernt nur die `<html>/<head>/<body>`-Rahmenzeilen) |
| `Portfolio-Tjark-Reichart.pdf` | PDF mit YouTube (11 Seiten) |
| `Portfolio-Tjark-Reichart-ohne-YouTube.pdf` | PDF ohne YouTube (10 Seiten) |
| `assets/img/*.jpg` | Bilder der Projekte (aus Plugin-Repos, Bravourfinds-PDF, Screenshots mit Beispieldaten) |
| `assets/img/covers/*.jpg` | Hochformat-Cover 600×800 (3:4) für Startseiten-Raster und Hover-Bild der Projektliste; `kontakt.jpg` 4:5; `blue.jpg` ist eine erzeugte Wellenform |
| `assets/img/blue-hero.jpg` | Querformat-Wellenform als Kopfbild der Seite „Blue“ |
| `assets/img/yt/vol1–8.jpg` | YouTube-Thumbnails (von `i.ytimg.com/vi/<id>/sddefault.jpg`, schwarze Balken auf 640×360 abgeschnitten: `crop=640:360:0:60`) |
| `assets/audio/blue.mp3` | Der Song „Blue“ |

## Layout: Lovable-Template (seit 15.11.2026)

Tjark hat das Layout vom Lovable-Projekt `5aa1053c-657f-4a7f-b529-abe1ab10db80` („Dark Creative Portfolio“, Beispiel „Jordan Studio“)
gewählt, **für beide Fassungen und beide PDFs**. Das Projekt ist privat; lesen geht mit den Lovable-Werkzeugen
(`mcp__Lovable__read_file` usw., per ToolSearch laden). Übernommen wurde: Syne (Überschriften) + Inter (Text), scharfe Kanten,
dunkel als Standard (hell über den Schalter), Akzent `#e6ff00`, Startseite mit 4×2-Bildraster hinter dem großen Namen (folgt der Maus),
Projektliste mit Hover-Zeile in Akzentfarbe und schwebendem Bild, Projektseiten mit Vollbild-Kopf (Kopfleiste erscheint dort erst,
wenn die Maus oben ist oder gescrollt wurde), „Zurück zu den Projekten“, Footer mit laufendem Namen, Über mich, Kontakt.

- **Ansichten statt Seiten:** `<section class="view" id="…">`, gewechselt über `#hash` (nur einfache Namen, kein `#/pfad`):
  `start`, `projekte`, je Projekt `bravourfinds`, `tshirtalshose`, `blue`, `auric-master`, `vox-clear`, `bandzentrale`, `sparplan`, dazu `ueber-mich`, `kontakt`.
  Ohne JavaScript stehen alle Ansichten untereinander.
- **Farben nur über die Tokens** in `:root` (dunkel) und `:root[data-theme="light"]`. Der Akzent `--accent` (Füllung) ist eine einzige Variable.
  `--accent-text` ist der Akzent als Textfarbe (im hellen Design ein dunkles Oliv, wegen des Kontrasts). Kein Farbwechsel je Projekt.
- **Bewegung:** Alles muss ohne Animation sichtbar sein; Animationen nur über `transform`, nie `opacity:0` als Startzustand.
  `prefers-reduced-motion` schaltet alles ab. Hover-Effekte nur auf Geräten mit Maus.
- **Der „grüne Faden“** (frühere Version mit Schiene, Knoten und Projektfarben) ist mit dem Layoutwechsel entfallen. Verbindungen
  zeigen nur noch die Querverweise `.xl` („Verbindet sich mit“) und „Nächstes Projekt“ am Ende jeder Projektseite. Fragen, ob Tjark
  den grünen Faden zurückhaben will, nicht von selbst wieder einbauen.
- Reihenfolge nach Thema, nicht nach Datum: Bravourfinds → TSHIRTALSHOSE → Blue → Auric Master → Vox Clear → Bandzentrale → Sparplan-Kompass.

### Ein Projekt hinzufügen
1. `<section class="view project" id="…" data-title="…">` kopieren (Kopfbild, Details `Art/Jahr/Umsetzung/Technik/Kategorien`, Lead, Stichpunkte, „Gelernt“, Galerie, `.xl`, `data-pn`).
2. Zeile in der Projektliste `.rows` (mit `.chips`, `.year`, `.pg` und `.float`-Cover) und Zelle im Startseiten-Raster `.hero-grid` (8 Zellen; bei mehr Projekten Raster anpassen).
3. Cover 600×800 in `assets/img/covers/`, Text „N eigene Projekte“ in `.hero-bio` und die Aufzählung dort anpassen.
4. Seitenzahlen `S. n` in der Liste (Projekte beginnen auf Seite 3; `variant.py` zählt die Variante selbst).
5. `./tools/build-all.sh`, jede Seite der PDFs ansehen (Verkleinerung steht in der Ausgabe, Werte unter ca. 0,7 sind zu klein).

### YouTube-Teile
Alles, was nur mit YouTube gehört, in `<!-- nur-mit-youtube -->…<!-- /nur-mit-youtube -->` einschließen (Zeilenblock oder inline),
CSS in `/* nur-mit-youtube */…/* /nur-mit-youtube */`. Ersatz nur für die Variante: `<!--ohne-youtube:…-->` (ohne `-->` darin).
Neue Folge: Thumbnail laden, zuschneiden (`vol9.jpg`), in `.yt` an die große Stelle (`.feat`, „neueste Folge“), die bisherige Folge
wird zur kleinen Kachel (Caption mit Ort), „bisher N Folgen“ im Lead anpassen. Die Kanal-ID ist `UC54sDwnKMb9eQxrsHTg5SPQ`.
VOL.8 = Video `EVAyt8hHdUg`, hochgeladen am 14.11.2026, Thumbnail zeigt ein Konzert ohne Ortsangabe (deshalb keine Ortsbezeichnung in der Caption).

## Veröffentlichung

Tjark verschickt die **PDF**. Auf Deckblatt und Kontaktseite steht der Link zur jeweils passenden Online-Fassung
(Elemente `.print-only`, nur im Druck sichtbar). Beide Artifacts müssen über Teilen → „Jeder mit dem Link“ freigegeben sein; das macht Tjark selbst.

1. **Claude-Artifacts:** mit YouTube https://claude.ai/artifact/Jn33i7LNbS8sLHWa1Dg8Mx (`build/artifact.html`),
   ohne YouTube https://claude.ai/artifact/EbLVkFa3xryE3ffkJ2T1EQ (`build/artifact-ohne-youtube.html`).
   Nach jeder Änderung `./tools/build-all.sh`, dann beide Dateien mit dem Artifact-Tool veröffentlichen, jeweils mit `url` = Link.
   Neue oder geänderte Bilder im `files`-Map mitgeben (veröffentlichter Pfad = Pfad im Repo, z. B. `assets/img/covers/neu.jpg`).
2. **GitHub Pages** (wenn aktiviert): Die Seite wird direkt aus dem Repo ausgeliefert, Push genügt.
3. **PDFs:** entstehen mit `./tools/build-all.sh`, beide mit committen. Druckregeln stehen im `@media print`-Block von `index.html`.
4. Die Canva-Präsentation (https://canva.link/1t3gww3ohbc36ia) ist veraltet und wird nicht mehr gepflegt.

Alle Fassungen müssen gleich bleiben: Immer erst `index.html` ändern, dann Artifacts, PDFs und GitHub aktualisieren.

## Inhalt und Ton

- **Wenig Text.** Tjark will keinen unnötigen Text: pro Projekt ein Satz Lead, 3–4 kurze Stichpunkte, „Gelernt“ in einem Satz. Lieber Bilder als Absätze.
- **Keine Reichweiten-Zahlen** (Follower, Likes, Aufrufe, Abonnenten) – hat Tjark bewusst entfernt. Technische Angaben (CPU, Latenz, Anzahl ETFs) sind in Ordnung.
- Kein Spruch auf dem Deckblatt (hat Tjark entfernt). Keine Fähigkeiten-Tabelle, keine Übergangs-Sätze zwischen Projekten.
- „Blue“ ist in der PDF nur als Wellenform zu sehen, ohne Link zum Anhören (Tjarks Entscheidung); online lässt es sich abspielen.
- Ich-Form für die eigene Person. Niemanden direkt ansprechen (kein „Sie“, kein „du“), keine Bewerbungsbezüge
  (Ausbildung, Studium, Stelle), damit die Seite für jeden passt. Nur bestehende Projekte zeigen.
- Nur belegbare Fakten. Quellen: READMEs von `d8bn77pbr4-cmd/Vox-Clear` und `d8bn77pbr4-cmd/Auric-Master`,
  das Bravourfinds-PDF, die YouTube-Kanalseite/RSS.
- **KI-Nutzung offen nennen.** Plugins und Web-Apps wurden mit KI (Claude) programmiert. Die Rolle der Person ist
  Idee, Anforderungen, Testen, Nachschärfen. Nie so formulieren, als sei der Code von Hand geschrieben.

## Fakten zur Person (Stand November 2026)

**Öffentlich gezeigt wird nur die E-Mail-Adresse.** Alter, Wohnort und Abitur stehen hier nur zur Information und kommen nicht auf die Seite.

Tjark Reichart, 19, 56479 Westernohe · Abitur März 2026 · Deutsch (Muttersprache), Englisch (gut, Leistungskurs) ·
E-Mail tjarkreichart9@gmail.com · Videos geschnitten mit CapCut, teils DaVinci Resolve · Bravourfinds seit 2024.

## Sparplan-Kompass

Gebaut in der Claude-Sitzung „Trade Republic ETF-Analyse-Website“ (Oktober 2026). Live unter
https://sparplan.bg65ykm46p.workers.dev, aber hinter Cloudflare Access (Login per E-Mail), daher nicht öffentlich.
Vorschau-Artifact: https://claude.ai/artifact/JstZe8t5MEYfofb6DMbqc7 – daraus stammen die Screenshots
(`sparplan-start.jpg`, `sparplan-prognose.jpg`, Broker „Andere Bank“, Beispieldepot). Keine Broker-Logos oder -Namen im Portfolio zeigen.

## Offen

- **5-Minuten-Clip von VOL.8** auf der Seite TSHIRTALSHOSE, nur in der Fassung mit YouTube (in der PDF bleibt das Thumbnail mit Link).
  Es fehlt die Videodatei: YouTube blockiert den Download aus der Cloud-Umgebung (Bot-Abfrage, wird nicht umgangen), Tjark kann sie
  nicht anhängen. Wege: Datei über Google Drive teilen (Drive-Zugriff ist eingerichtet) oder selbst zuschneiden und klein exportieren.
  Ein Artifact nimmt nur etwa 15 MB pro Datei, fünf Minuten passen also nur in ca. 480p. Außerdem nötig: welche fünf Minuten.
  Einbau dann als `<video controls preload="metadata" poster="assets/img/yt/vol8.jpg">` im Block `.gallery` der Ansicht `tshirtalshose` (innerhalb der nur-mit-youtube-Markierung).
- Neue offene Stellen als `<span class="todo">…</span>` markieren, falls sie auftauchen (Klasse `.todo` neu anlegen).
