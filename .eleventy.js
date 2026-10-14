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
  // Rend un <span> désactivé tant que le lien Stripe n'est pas résolu,
  // un <a> tracké sinon. Le prix vient TOUJOURS de site.json.
  eleventyConfig.addShortcode("cta", function (product, position, label) {
    const ready = isStripeReady(product.stripeLink, process.env.STRIPE_READY);
    const text = `${label || "Je commence"} : ${product.priceLaunch}€`;
    const track = `data-track="cta_click" data-track-props='${JSON.stringify({
      product: product.slug,
      position,
    })}'`;
    if (!ready) {
      return `<span class="cta-primary cta-disabled" aria-disabled="true">${text}</span>`;
    }
    return `<a href="${product.stripeLink}" class="cta-primary" ${track}>${text}</a>`;
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
