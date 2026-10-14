// Règle de détection du placeholder Stripe, définie UNE FOIS.
// Utilisée par le shortcode CTA (.eleventy.js), data.test.js, build.test.js, stripe.test.js.
// Ne JAMAIS dupliquer cette logique ailleurs : importer ce module.
module.exports = function isStripeReady(stripeLink, stripeReadyEnv) {
  return (
    stripeReadyEnv === "true" &&
    typeof stripeLink === "string" &&
    stripeLink.length > 0 &&
    !stripeLink.includes("__REMPLACE")
  );
};
