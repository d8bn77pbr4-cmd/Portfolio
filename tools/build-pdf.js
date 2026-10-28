// Erzeugt Portfolio-Tjark-Reichart.pdf aus index.html: A4 quer, Einstieg, je Station eine Seite, Fähigkeiten, Kontakt.
// Aufruf: node tools/build-pdf.js   (braucht Playwright mit Chromium)
const { chromium } = require("playwright");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "Portfolio-Tjark-Reichart.pdf");
// A4 quer minus 10 mm Rand rundum, in CSS-Pixeln (96 dpi)
const PAGE_W = Math.floor((277 / 25.4) * 96), PAGE_H = Math.floor((190 / 25.4) * 96);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: PAGE_W, height: PAGE_H }, colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("file://" + path.join(root, "index.html"), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.querySelectorAll("img").forEach(i => { i.loading = "eager"; });
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    await document.fonts.ready;
  });
  await page.emulateMedia({ media: "print", colorScheme: "light", reducedMotion: "reduce" });

  // Jede Druckseite so verkleinern, dass sie auf eine Seite passt
  const zooms = await page.evaluate(pageH => {
    const groups = [[document.querySelector(".hero"), document.querySelector(".mapsec")]];
    for (const st of document.querySelectorAll(".station")) {
      const prev = st.previousElementSibling;
      groups.push(prev && prev.classList.contains("hop") ? [prev, st] : [st]);
    }
    groups.push([document.getElementById("faehigkeiten")], [document.getElementById("kontakt")]);
    const height = els => {
      const first = els[0].getBoundingClientRect(), last = els[els.length - 1].getBoundingClientRect();
      return last.bottom - first.top + 8;
    };
    return groups.map(els => {
      let z = 1;
      for (let i = 0; i < 6; i++) {
        const h = height(els);
        if (h <= pageH) break;
        z = Math.max(0.35, z * (pageH / h) * 0.995);
        // Breite festhalten, damit beim Verkleinern alles gleichmäßig schrumpft statt breiter umzubrechen
        for (const el of els) { if (!el.style.width) el.style.width = el.getBoundingClientRect().width + "px"; el.style.zoom = z; el.style.setProperty("--z", z); }
      }
      return Math.round(z * 100) / 100;
    });
  }, PAGE_H);

  await page.pdf({ path: out, format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(out, "Verkleinerung je Seite:", zooms.join(" "));
})();
