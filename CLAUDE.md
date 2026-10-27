# Portfolio Tjark Reichart – Hinweise für Änderungen

Bewerbungsportfolio von Tjark Reichart (Ausbildung oder Studium), auf Deutsch. Eine einzige statische Seite ohne Build-Werkzeuge.
Titel der Seite: „Portfolio Tjark Reichart“.

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | **Die einzige Quelle.** Inhalt, CSS und JS in einer Datei. Alle Änderungen hier. |
| `assets/img/*.jpg` | Bilder der Projekte (aus Plugin-Repos, Bravourfinds-PDF, Screenshot der Bandzentrale mit Beispieldaten) |
| `assets/img/yt/vol1–7.jpg` | YouTube-Thumbnails (von `i.ytimg.com/vi/<id>/sddefault.jpg`, schwarze Balken auf 640×360 abgeschnitten) |
| `assets/audio/blue.mp3` | Der Song „Blue“ |
| `tools/build-artifact.sh` | Erzeugt `build/artifact.html` für das Claude-Artifact (entfernt nur die `<html>/<head>/<body>`-Rahmenzeilen) |

## Veröffentlichung

1. **Claude-Artifact:** https://claude.ai/artifact/Jn33i7LNbS8sLHWa1Dg8Mx
   Nach jeder Änderung an `index.html`: `./tools/build-artifact.sh`, dann mit dem Artifact-Tool
   `build/artifact.html` veröffentlichen, mit `url` = obiger Link. Geänderte oder neue Bilder im `files`-Map mitgeben
   (veröffentlichter Pfad = Pfad im Repo, z. B. `assets/img/neu.jpg`).
2. **GitHub Pages** (wenn aktiviert): Die Seite wird direkt aus dem Repo ausgeliefert, Push genügt.

Beide Fassungen müssen gleich bleiben: Immer erst `index.html` ändern, dann beide aktualisieren.

## Der grüne Faden (Gestaltungsregel)

Die Seite ist eine Route. Jedes Projekt ist eine **Station** (`<article class="station">`), dazwischen steht ein **Knoten**
(`<div class="hop">`), der erklärt, wie das eine Projekt zum nächsten geführt hat. Die grüne Schiene links füllt sich beim Scrollen.

Ein neues Projekt hinzufügen heißt immer:
1. Station anlegen (Nummer im `.node`, `st-meta`, `h2`, `st-lead`, Blöcke Idee / Umsetzung / Meine Rolle / Gelernt, Medien, `spec`).
2. Knoten davor und danach anpassen, damit die Begründung „Daraus folgt“ logisch bleibt.
3. Eintrag in der Karte `ol.map` oben (bei mehr als 8 Einträgen `grid-template-columns` anpassen).
4. Spalte in der Tabelle `.matrix` unter „Was sich durchzieht“.
5. Querverweise `.xlinks` („Verbindet sich mit“) in den betroffenen Stationen ergänzen.

Farben nur über die Tokens in `:root` (hell) und die beiden Dark-Blöcke. Grün = der Faden und „Gelernt“, Blau = Akzent aus Bravourfinds/Plugins.
Schriften: Archivo (Überschriften, breit), Source Serif 4 (Text), JetBrains Mono (Daten, Labels).

## Inhalt und Ton

- **Wenig Text.** Tjark will keinen unnötigen Text: pro Station ein Satz Lead, 3–4 kurze Stichpunkte, „Gelernt“ in einem Satz,
  Knoten zwischen Stationen in einem Satz. Lieber Bilder und Zahlen als Absätze.
- Ich-Form für die eigene Person, „Sie“ für die Lesenden (Arbeitgeber, Hochschulen).
- Nur belegbare Fakten. Quellen: READMEs von `d8bn77pbr4-cmd/Vox-Clear` und `d8bn77pbr4-cmd/Auric-Master`,
  das Bravourfinds-PDF, die YouTube-Kanalseite/RSS (`UC54sDwnKMb9eQxrsHTg5SPQ`).
- **KI-Nutzung offen nennen.** Plugins und Web-Apps wurden mit KI (Claude) programmiert. Die Rolle der Person ist
  Idee, Anforderungen, Testen, Nachschärfen. Nie so formulieren, als sei der Code von Hand geschrieben.
- Zahlen mit Stand angeben, wenn sie sich ändern (YouTube-Aufrufe, Follower).

## Fakten zur Person (Stand Oktober 2026)

Tjark Reichart, 19, 56479 Westernohe · Abitur März 2026 · Deutsch (Muttersprache), Englisch (gut, Leistungskurs) ·
E-Mail tjarkreichart9@gmail.com · Videos geschnitten mit CapCut, teils DaVinci Resolve · Bravourfinds seit 2024.

## Sparplan-Kompass (Station 7)

Gebaut in der Claude-Sitzung „Trade Republic ETF-Analyse-Website“ (Oktober 2026). Live unter
https://sparplan.bg65ykm46p.workers.dev, aber hinter Cloudflare Access (Login per E-Mail), daher nicht öffentlich.
Vorschau-Artifact: https://claude.ai/artifact/JstZe8t5MEYfofb6DMbqc7 – daraus stammen die Screenshots
(`sparplan-start.jpg`, `sparplan-prognose.jpg`, Broker „Andere Bank“, Beispieldepot). Keine Broker-Logos oder -Namen im Portfolio zeigen.

## Offene Platzhalter

Keine. Neue offene Stellen als `<span class="todo">…</span>` markieren (orange, gestrichelt).
