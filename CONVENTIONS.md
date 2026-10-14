# CONVENTIONS.md — règles pour maintenir ce repo avec un LLM

Ce repo est maintenu par un LLM autonome (et Guillaume). Ces règles sont obligatoires. Les tests échouent si tu les enfreins.

## Architecture en 5 lignes

1. `src/pages/*.njk` = les pages (copy FR), compilées par Eleventy vers `dist/*.html` (permaliens à plat, ex `/guide-express.html`).
2. `src/_data/site.json` = **unique source de vérité** : prix, liens Stripe/Podia, produits, légal, tracking.
3. `src/_layouts/` + `src/_includes/` = structure partagée (base, legal, product, head, footer, cta).
4. `src/css/styles.css` + `src/js/main.js` = design system + logique client (aucun JS inline).
5. `test/` = garde-fous (data, build, stripe). Build Netlify : `npm ci && npx eleventy && npx jest`.

## Règles absolues

1. **Toute valeur métier** (prix, lien, date, SIRET, email, id Umami) vit dans `src/_data/site.json`. JAMAIS en dur dans un template.
2. **Le lien Stripe** ne s'affiche que via le shortcode `{% cta product, 'position', 'label' %}`. Il rend un span désactivé tant que le Payment Link n'est pas résolu (règle unique dans `lib/stripe-rule.js`). Ne jamais afficher un prix définitif ni un CTA cliquable tant que le lien Stripe contient `__REMPLACE`.
3. **Placeholders `[STRIPE_LINK]` / `[DATE_LIMITE]` interdits** dans les templates : utilise `{{ product.priceLaunch }}`, `{{ product.dateLimit }}`, `{% cta %}`.
4. **Zéro JS inline** : pas d'`onclick=`/`onsubmit=`. Tracking via attributs `data-track` / `data-track-props`, logique dans `src/js/main.js`.
5. **Pas de tiret cadratin (—)** dans la copy. Contenu FR, tutoiement, phrases courtes.
6. **Modifier `site.json` uniquement pour changer une valeur métier.** Un template ne modifie jamais la config.
7. **Un fichier non listé dans `addPassthroughCopy` (`.eleventy.js`) n'atteint pas dist/.** Assets statiques → `public/` (copié tel quel).
8. **Schéma produit homogène** : `slug, name, title, tagline, priceLaunch, priceRegular, dateLimit, stripeLink, podiaLink, publishPage`. Pas de champ optionnel hétérogène.
9. **Ajouter un produit** = (1) objet dans `site.json` (il apparaît automatiquement dans confirmation + select rétractation), (2) page `src/pages/<slug>.njk` avec `productSlug`, (3) `publishPage: true` quand sa landing doit être servie.
10. **Pages racine hors build** : `budget-a-deux.html` et `runway.html` sont volontairement NON migrés et exclus de dist (redirigés via netlify.toml). Ne pas les éditer pour le site public.

## Tests = filet de sécurité

- `npm run verify` = build + tests. À lancer après CHAQUE modification.
- `test/data.test.js` : invariants de config (prix, schéma, UUID, SIRET...).
- `test/build.test.js` : pages générées valides, zéro placeholder, CTA dans le bon état, pas de JS inline.
- `test/stripe.test.js` : activé seulement quand le lien Stripe est résolu (`STRIPE_READY=true`).

## Workflow type

1. Changer un prix : `src/_data/site.json` → `npm run verify`.
2. Changer la copy d'une page : le fichier `.njk` correspondant → `npm run verify`.
3. Ajouter une section commune aux produits : `src/_layouts/product.njk`.
4. Toucher à la logique client : `src/js/main.js` (guard par présence d'élément).
