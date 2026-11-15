// Erzeugt beide PDFs: Portfolio-Tjark-Reichart.pdf (aus index.html) und Portfolio-Tjark-Reichart-ohne-YouTube.pdf
// (aus ohne-youtube.html, vorher python3 tools/variant.py). A4 quer, dunkel: Deckblatt, Projektliste mit Seitenzahlen,
// je Projekt eine Seite, Über mich, Kontakt. Jede Ansicht (.view) ist eine Seite; zu hohe Seiten werden über zoom auf .fit verkleinert.
// Aufruf: node tools/build-pdf.js   (braucht Playwright mit Chromium)
const { chromium } = require("playwright");
const path = require("path");

const root = path.resolve(__dirname, "..");
const VARIANTS = [
  ["index.html", "Portfolio-Tjark-Reichart.pdf"],
  ["ohne-youtube.html", "Portfolio-Tjark-Reichart-ohne-YouTube.pdf"],
];
// A4 quer in CSS-Pixeln (96 dpi), Rand 38 px rundum innerhalb jeder Seite (steht im @media print-Block)
const PAGE_W = 1122, PAGE_H = 793, PAD = 38;

async function buildPdf(browser, input, output) {
  const out = path.join(root, output);
  const page = await browser.newPage({ viewport: { width: PAGE_W, height: PAGE_H }, colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("file://" + path.join(root, input), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.querySelectorAll("img").forEach(i => { i.loading = "eager"; });
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    await document.fonts.ready;
  });
  await page.emulateMedia({ media: "print", colorScheme: "dark", reducedMotion: "reduce" });

  const zooms = await page.evaluate(({ maxH, w }) => {
    const result = [];
    for (const view of document.querySelectorAll(".view")) {
      const fit = view.querySelector(".fit");
      fit.style.zoom = "";
      fit.style.width = w + "px";
      let z = 1;
      for (let i = 0; i < 8; i++) {
        const h = fit.getBoundingClientRect().height;
        if (h <= maxH) break;
        z = Math.max(0.3, z * (maxH / h) * 0.995);
        // Layoutbreite mitwachsen lassen, damit die sichtbare Breite gleich bleibt und nichts schmaler umbricht
        fit.style.zoom = z;
        fit.style.width = (w / z) + "px";
      }
      result.push(Math.round(z * 100) / 100);
    }
    return result;
  }, { maxH: PAGE_H - 2 * PAD - 3, w: PAGE_W - 2 * PAD });

  await page.pdf({ path: out, format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true });
  await page.close();
  console.log(output, "Verkleinerung je Seite:", zooms.join(" "));
}

(async () => {
  const browser = await chromium.launch();
  for (const [input, output] of VARIANTS) await buildPdf(browser, input, output);
  await browser.close();
})();
