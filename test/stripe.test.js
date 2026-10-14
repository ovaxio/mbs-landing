const fs = require("fs");
const path = require("path");
const site = require("../src/_data/site.json");
const isStripeReady = require("../lib/stripe-rule");

const DIST = path.join(__dirname, "..", "dist");
const read = (f) => fs.readFileSync(path.join(DIST, f), "utf8");

const product = site.products.find((p) => p.publishPage);
const stripeReady = isStripeReady(product.stripeLink, process.env.STRIPE_READY);

// Conditionnel : ne tourne que quand le lien Stripe est réellement résolu
// (STRIPE_READY=true + pas de placeholder). Sinon, silencieusement skippé.
(stripeReady ? describe : describe.skip)("stripe : CTA cliquable vers Payment Link", () => {
  test("le lien de site.json est une URL Payment Link Stripe valide", () => {
    expect(product.stripeLink).toMatch(/^https:\/\/buy\.stripe\.com\/[^_]+$/);
  });

  test("les 3 emplacements CTA de la landing pointent vers le lien Stripe", () => {
    const html = read("guide-express.html");
    const links = html.match(new RegExp(`href="${product.stripeLink}"`, "g")) || [];
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  test("aucun CTA désactivé résiduel", () => {
    expect(read("guide-express.html")).not.toContain("cta-disabled");
  });
});
