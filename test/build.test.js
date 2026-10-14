const fs = require("fs");
const path = require("path");
const site = require("../src/_data/site.json");
const isStripeReady = require("../lib/stripe-rule");

const DIST = path.join(__dirname, "..", "dist");
const read = (f) => fs.readFileSync(path.join(DIST, f), "utf8");

const PAGES = [
  "index.html",
  "guide-express.html",
  "confirmation.html",
  "mentions-legales.html",
  "cgv.html",
  "confidentialite.html",
  "retractation.html",
  "404.html",
];

const product = site.products.find((p) => p.publishPage);
const stripeReady = isStripeReady(product.stripeLink, process.env.STRIPE_READY);

describe("pages générées", () => {
  test.each(PAGES)("%s existe et est une page valide", (f) => {
    const html = read(f);
    expect(html).toContain('<html lang="fr">');
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toContain("<meta charset");
    expect(html).toContain('name="viewport"');
  });

  test("footer avec les 4 liens légaux sur les pages avec footer (hors 404)", () => {
    for (const f of PAGES.filter((p) => p !== "404.html")) {
      const html = read(f);
      expect(html).toContain('href="/mentions-legales.html"');
      expect(html).toContain('href="/confidentialite.html"');
      expect(html).toContain('href="/cgv.html"');
      expect(html).toContain('href="/retractation.html"');
    }
  });

  test("aucun placeholder résiduel dans dist/", () => {
    for (const f of PAGES) {
      const html = read(f);
      expect(html).not.toContain("[STRIPE_LINK]");
      expect(html).not.toContain("[DATE_LIMITE]");
      expect(html).not.toContain("__REMPLACE");
    }
  });

  test("assets CSS et JS émis dans dist/", () => {
    expect(fs.existsSync(path.join(DIST, "css", "styles.css"))).toBe(true);
    expect(fs.existsSync(path.join(DIST, "js", "main.js"))).toBe(true);
    expect(read("js/main.js")).toContain("umami.track");
  });

  test("index.html pointe vers la landing guide-express", () => {
    expect(read("index.html")).toContain('href="/guide-express.html"');
  });

  test("confirmation.html : routing par boucle sur products[], pas de lien Podia en dur", () => {
    const html = read("confirmation.html");
    expect(html).toContain("__MBS_CHECKOUT__");
    expect(html).toContain('id="confirmation-title"');
    // Aucun lien Podia codé en dur dans un href : les liens passent par la map injectée
    for (const p of site.products) {
      expect(html).not.toMatch(new RegExp(`href=["']${p.podiaLink}`));
    }
    // La map injectée contient bien les 3 produits
    for (const p of site.products) {
      expect(html).toContain(`"${p.slug}"`);
    }
  });

  test("retractation.html : select produit généré depuis products[]", () => {
    const html = read("retractation.html");
    expect(html).toContain('name="retractation"');
    expect(html).toContain('data-netlify="true"');
    for (const p of site.products) {
      expect(html).toContain(`<option value="${p.slug}">`);
    }
  });

  test("tracking Umami présent avec l'id de site.json (sauf 404)", () => {
    for (const f of PAGES.filter((p) => p !== "404.html")) {
      expect(read(f)).toContain(site.tracking.umamiId);
    }
    expect(read("404.html")).not.toContain("umami");
  });

  describe("CTA Stripe guide-express selon état", () => {
    if (stripeReady) {
      test("état ready : CTA cliquable pointant vers le lien Stripe de site.json", () => {
        const html = read("guide-express.html");
        expect(html).toContain(`href="${product.stripeLink}"`);
        expect(html).not.toContain("cta-disabled");
      });
    } else {
      test("état transitoire : CTA désactivé, jamais de lien cliquable vers le placeholder", () => {
        const html = read("guide-express.html");
        expect(html).toContain("cta-disabled");
        expect(html).not.toMatch(/<a[^>]+href="[^"]*__REMPLACE/);
        expect(html).not.toContain(`href="${product.stripeLink}"`);
      });
    }
  });

  test("prix et date limit rendus depuis site.json sur la landing produit", () => {
    const html = read("guide-express.html");
    expect(html).toContain(`${product.priceLaunch}€`);
    expect(html).toContain(`${product.priceRegular}€`);
    expect(html).toContain(product.dateLimit);
  });

  test("pas de JS inline (onclick) dans les pages", () => {
    for (const f of PAGES) {
      expect(read(f)).not.toMatch(/\sonclick=/);
    }
  });
});

describe("conformité légale (audit multifractal 2026-09-02)", () => {
  test("aucun lien localhost ni plateforme ODR fermée dans dist/", () => {
    for (const f of PAGES) {
      const html = read(f);
      expect(html).not.toContain("localhost:8080");
      expect(html).not.toContain("ec.europa.eu/consumers/odr");
    }
  });

  test("rétractation : fonctionnalité D221-5 (libellés exacts + champs obligatoires)", () => {
    const html = read("retractation.html");
    expect(html).toContain("Renoncer au contrat ici");
    expect(html).toContain("Confirmer la rétractation");
    expect(html).toContain('name="nom"');
    expect(html).toContain('name="prenom"');
    expect(html).toContain('name="numero_commande"');
    expect(html).toContain("accusé de réception");
  });

  test("CGV : encadré garantie légale des contenus numériques (D211-4) présent", () => {
    const html = read("cgv.html");
    expect(html).toContain("garantie légale de conformité");
    expect(html).toContain("L. 224-25-1 à L. 224-25-31");
    expect(html).toContain("amende civile");
    expect(html).toContain("242-18-1");
  });

  test("CGV : délai de remboursement conforme L221-24", () => {
    const html = read("cgv.html");
    expect(html).toContain("à compter du jour où le professionnel est informé");
    expect(html).toContain("même moyen de paiement");
  });

  test("CGV : annonce précontractuelle de la fonctionnalité de rétractation (L221-5 I 7°)", () => {
    const html = read("cgv.html");
    expect(html).toContain("/retractation.html#renoncer");
    expect(html).toContain("Renoncer au contrat ici");
  });

  test("CGV : vocabulaire contenus numériques + clause juridiction conforme", () => {
    const html = read("cgv.html");
    expect(html).toContain("contenus numériques");
    expect(html).toContain("dispositions impératives plus protectrices");
    expect(html).not.toContain("les tribunaux français seront compétents.");
  });

  test("mentions légales : TVA intracommunautaire + hébergeur + médiation", () => {
    const html = read("mentions-legales.html");
    expect(html).toContain("TVA intracommunautaire");
    expect(html).toContain("FR81 999389471");
    expect(html).toContain("Netlify");
    expect(html).toContain("médiateur");
  });

  test("landing : annonce existence + emplacement fonctionnalité rétractation", () => {
    const html = read("guide-express.html");
    expect(html).toContain("/retractation.html#renoncer");
  });

  test("confidentialité : bases légales, destinataires nommés, transferts, durées", () => {
    const html = read("confidentialite.html");
    expect(html).toContain("bases légale");
    expect(html).toContain("Podia Labs, Inc.");
    expect(html).toContain("Netlify, Inc.");
    expect(html).toContain("clauses contractuelles types");
    expect(html).toContain("2021/914");
    expect(html).toContain("10 ans");
    expect(html).toContain("25 mois");
    expect(html).toContain("pseudonymisées");
    expect(html).toContain("umami-optout");
    expect(html).toContain("post-mortem");
    expect(html).not.toContain("Héberge les données sur des serveurs conformes au RGPD");
  });
});
