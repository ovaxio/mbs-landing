const path = require("path");
const site = require("./src/_data/site.json");
const isStripeReady = require("./lib/stripe-rule");

module.exports = function (eleventyConfig) {
  // ── Passthrough copy explicite ──
  // Un fichier non listé ici n'atteint pas dist/. Voir CONVENTIONS.md.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });
  eleventyConfig.addPassthroughCopy({ public: "public" });

  // ── Shortcode CTA : seule porte vers Stripe ──
  // STRIPE_READY=true + lien résolu → <a> tracké vers Stripe (vente).
  // Sinon → <a> vers l'inscription gratuite Podia (mode Phase 0 : capture email,
  // pas de bouton mort). Le prix vient TOUJOURS de site.json.
  eleventyConfig.addShortcode("cta", function (product, position, label) {
    const ready = isStripeReady(product.stripeLink, process.env.STRIPE_READY);
    const track = `data-track="cta_click" data-track-props='${JSON.stringify({
      product: product.slug,
      position,
    })}'`;
    if (!ready) {
      const fallbackLabel = label || "Accéder gratuitement au guide";
      return `<a href="${product.podiaLink}" class="cta-primary" ${track} rel="noopener">${fallbackLabel}</a>`;
    }
    const text = `${label || "Je commence"} : ${product.priceLaunch}€`;
    return `<a href="${product.stripeLink}" class="cta-primary" ${track} rel="noopener">${text}</a>`;
  });

  // Année courante pour le footer (pas de drift annuel).
  eleventyConfig.addShortcode("year", function () {
    return String(new Date().getFullYear());
  });

  // ── Routing confirmation : map générée depuis products[] au build ──
  // Injectée dans confirmation.njk via window.__MBS_CHECKOUT__ (plus jamais en dur).
  eleventyConfig.addGlobalData("productsMap", () =>
    Object.fromEntries(
      site.products.map((p) => [
        p.slug,
        { price: p.priceLaunch, name: p.name, podia: p.podiaLink },
      ])
    )
  );

  // Produits indexés par slug, pour les layouts/pages : productsBySlug['guide-express'].
  eleventyConfig.addGlobalData("productsBySlug", () =>
    Object.fromEntries(site.products.map((p) => [p.slug, p]))
  );

  // Vente activée ? (un seul produit publié : guide-express). Utilisé par les
  // templates pour adapter pricing + micro-copys au mode Phase 0 / vente.
  eleventyConfig.addGlobalData("stripeReady", () =>
    isStripeReady(site.products[0].stripeLink, process.env.STRIPE_READY)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "dist",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
  };
};
