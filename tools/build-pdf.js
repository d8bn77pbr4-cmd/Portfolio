// Erzeugt beide PDFs: Portfolio-Tjark-Reichart.pdf (aus index.html) und Portfolio-Tjark-Reichart-ohne-YouTube.pdf
// (aus ohne-youtube.html, vorher python3 tools/variant.py). A4 quer, dunkel: Deckblatt, Projektliste mit Seitenzahlen,
// je Projekt eine Seite, Über mich, Kontakt. Jede Ansicht (.view) ist eine Seite; zu hohe Seiten werden über zoom auf .fit verkleinert.
// Die PDFs sollen unter 2 MB bleiben (Versand per Mail): Bilder werden beim Bau auf ca. 200 ppi der gedruckten Größe verkleinert
// (Quelldateien bleiben unverändert), und .p-hero-img hat im Druck keinen Filter (sonst speichert Chromium es als riesiges Rasterbild).
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

  // Bilder auf die gedruckte Größe verkleinern (Canvas-Auslesen von file:// braucht --allow-file-access-from-files, siehe launch unten)
  const shrunk = await page.evaluate(async ({ ppi }) => {
    let before = 0, after = 0, n = 0;
    for (const img of document.querySelectorAll(".view img")) {
      const nw = img.naturalWidth, nh = img.naturalHeight, r = img.getBoundingClientRect();
      if (nw < 300 || !r.width || /\.svg(\?|$)/i.test(img.src)) continue;
      // object-fit: cover beschneidet, die Skalierung richtet sich nach der längeren Seite; gedruckt wird mit 96 CSS-px je Zoll
      const scale = Math.min(1, (ppi / 96) * Math.max(r.width / nw, r.height / nh));
      if (scale > 0.85) continue;
      const c = document.createElement("canvas");
      c.width = Math.round(nw * scale); c.height = Math.round(nh * scale);
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL("image/jpeg", 0.82);
      await new Promise(res => { img.onload = img.onerror = res; img.removeAttribute("loading"); img.src = url; });
      n++; before += nw * nh; after += c.width * c.height;
    }
    return { n, ratio: before ? Math.round(after / before * 100) : 100 };
  }, { ppi: 200 });
  await page.pdf({ path: out, format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true });
  await page.close();
  console.log(output, "Verkleinerung je Seite:", zooms.join(" "), `| ${shrunk.n} Bilder verkleinert (${shrunk.ratio} % der Pixel)`);
}

(async () => {
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  for (const [input, output] of VARIANTS) await buildPdf(browser, input, output);
  await browser.close();
})();
