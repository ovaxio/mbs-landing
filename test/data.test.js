const site = require("../src/_data/site.json");
const isStripeReady = require("../lib/stripe-rule");

describe("invariants de config (site.json)", () => {
  const slugs = site.products.map((p) => p.slug);

  test("products[] non vide, slugs uniques et non vides", () => {
    expect(site.products.length).toBeGreaterThan(0);
    const nonEmpty = site.products.every((p) => typeof p.slug === "string" && p.slug.length > 0);
    expect(nonEmpty).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test.each(site.products)("produit %s : prix cohérents + podiaLink https", (p) => {
    expect(p.priceLaunch).toBeGreaterThan(0);
    expect(p.priceRegular).toBeGreaterThan(p.priceLaunch);
    expect(p.podiaLink).toMatch(/^https:\/\//);
    expect(typeof p.name).toBe("string");
    expect(p.name.length).toBeGreaterThan(0);
    expect(typeof p.publishPage).toBe("boolean");
  });

  test("schéma produit homogène : 10 champs obligatoires pour chaque produit", () => {
    const REQUIRED = [
      "slug",
      "name",
      "title",
      "tagline",
      "priceLaunch",
      "priceRegular",
      "dateLimit",
      "stripeLink",
      "podiaLink",
      "publishPage",
    ];
    for (const p of site.products) {
      for (const field of REQUIRED) {
        expect(p).toHaveProperty(field);
      }
    }
  });

  test("dateLimit non vide pour les produits avec page publiée", () => {
    for (const p of site.products) {
      if (p.publishPage) {
        expect(p.dateLimit.length).toBeGreaterThan(0);
      }
    }
  });

  test("stripeLink : placeholder toléré tant que non résolu, URL Stripe exigée si ready", () => {
    const ready = isStripeReady(site.products[0].stripeLink, process.env.STRIPE_READY);
    for (const p of site.products) {
      expect(typeof p.stripeLink).toBe("string");
      expect(p.stripeLink.length).toBeGreaterThan(0);
      if (ready) {
        expect(p.stripeLink).toMatch(/^https:\/\/buy\.stripe\.com\//);
        expect(p.stripeLink).not.toContain("__REMPLACE");
      }
    }
  });

  test("umamiId est un UUID", () => {
    expect(site.tracking.umamiId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test("siret = 14 chiffres, siren = 9 chiffres (espaces ignorés)", () => {
    expect(site.legal.siret.replace(/\s/g, "")).toMatch(/^\d{14}$/);
    expect(site.legal.siren.replace(/\s/g, "")).toMatch(/^\d{9}$/);
  });

  test("brand.contactEmail et domain présents", () => {
    expect(site.brand.contactEmail).toMatch(/@/);
    expect(site.brand.domain).toBe("www.monbudgetsimple.fr");
  });
});
