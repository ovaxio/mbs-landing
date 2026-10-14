# CLAUDE.md — Projet Landing Pages MBS (Mon Budget Simple)

## Projet

Repo du site Mon Budget Simple (éducation financière en français), buildé avec Eleventy.
Le site est hébergé sur Netlify (www.monbudgetsimple.fr), séparé du site Podia (learn.monbudgetsimple.fr).

### Architecture

```
www.monbudgetsimple.fr (Netlify)       → Landing pages de vente + confirmation + homepage + pages légales
learn.monbudgetsimple.fr (Podia)       → Blog SEO + hébergement cours + espace membre
Stripe Payment Links                   → Paiement direct (39€ flat, sans code promo)
ActiveCampaign                         → Email marketing
Umami Cloud (data-website-id)          → Tracking (zéro cookie, pas de bandeau RGPD, indépendant de Google)
```

> ⚠️ Migration en cours (2026-09-01) : le site passe de `go.` (Netlify) + `www.` (Podia) à
> `www.` (Netlify) + `learn.` (Podia). GTM/GA4/Google Ads retirés au profit d'Umami (zéro cookie).

### Flow d'achat

1. Client arrive sur `www.monbudgetsimple.fr/guide-express` (landing page)
2. Clic CTA → Stripe Payment Link 39€ flat (paiement hébergé par Stripe)
3. Après paiement → `www.monbudgetsimple.fr/confirmation?product=guide-express&session_id=...`
4. Page de confirmation : lien d'accès Podia + événement `purchase` Umami
5. Email ActiveCampaign envoyé en parallèle avec le lien Podia

### Livraison des formations

Les formations sont hébergées sur Podia (`learn.monbudgetsimple.fr`). Après paiement Stripe, le client accède à sa formation via un lien d'inscription gratuit Podia affiché sur la page de confirmation.
Pas de bridge technique (webhook/API) — le client s'inscrit lui-même sur Podia.
**Contrôle payé/inscrit (Option B, MVP)** : Podia notifie Guillaume à chaque inscription → il vérifie dans le Dashboard Stripe que l'email a payé → si non, il retire l'accès. Automatisation (webhook Stripe → script VPS) si les ventes montent.
Quand le volume dépasse 50 ventes/mois, automatiser via Make.com (Stripe webhook → Podia API).

---

## Stack technique

- **Eleventy (11ty) v3** — SSG Node. Source : `src/`, output : `dist/` (publish Netlify). Permaliens à plat (`/guide-express.html`).
- **`src/_data/site.json`** — SOURCE DE VÉRITÉ unique : prix, liens Stripe/Podia, produits[], légal, tracking. JAMAIS de valeur métier en dur dans un template.
- **Templates** — Nunjucks `.njk` : pages dans `src/pages/`, layouts dans `src/_layouts/` (base, legal, product), partials dans `src/_includes/` (head, footer). Héritage via `{% extends %}`.
- **CTA Stripe** — shortcode `{% cta product, 'position', 'label' %}`. Rend un span désactivé tant que le Payment Link contient `__REMPLACE` (règle unique : `lib/stripe-rule.js`).
- **CSS** — `src/css/styles.css` (design system) + styles page dans les blocks `headExtra` des templates. Custom properties, pas de framework CSS
- **JS** — vanilla, un seul fichier `src/js/main.js` (reveal, FAQ, sticky, tracking data-track, rétractation, routing confirmation). Zéro JS inline (`onclick` interdit).
- **Fonts** — Google Fonts via CDN : `DM Serif Display` (titres), `Inter` (body)
- **Tracking** — Umami Cloud (snippet dans `head.njk`, id depuis site.json), zéro cookie. Événement `purchase` sur confirmation avec garde `session_id`. **Plus de GTM, plus de GA4, plus de Google Ads.**
- **Tests** — Jest (`test/data.test.js`, `build.test.js`, `stripe.test.js` conditionnel). Build Netlify : `npm ci && npx eleventy && npx jest`.
- **Déploiement** — Netlify, domaine `www.monbudgetsimple.fr`, publish `dist/`
- **Paiement** — Stripe Payment Links (pas d'API, pas de backend)
- **Pas de** : React, framework CSS, SCSS, PostCSS, bundler

> ⚠️ Règles de maintenance complètes pour LLM : **CONVENTIONS.md** (fait foi pour l'architecture).

---

## Design System MBS

> **La charte canonique est `BRAND.md` (même dossier), valeurs machine dans `brand.tokens.json`.**
> Couleurs, contrastes, typographie, imagerie, portage Podia : tout est là, et en cas de divergence
> avec n'importe quel autre document, c'est `BRAND.md` qui fait foi. Ne pas recopier ses valeurs ici.

Rappels opérationnels propres à ce repo :

- Toujours passer par les variables CSS de `:root` dans `styles.css`, jamais de couleur en dur.
- Couleur d'action des CTA = `--terracotta-dark` (`#A8503D`). `--terracotta` reste l'accent de marque
  et ne porte jamais de texte blanc en taille courante.
- Fontes : `DM Serif Display` (titres, graisse 400 uniquement) + `Inter` (corps).

## Structure type d'une landing page

Chaque landing page suit cette structure de sections (dans l'ordre) :

1. **Topbar** — barre de confiance sombre (`--brown`), une ligne de texte
2. **Social proof bar** — chiffres clés (icônes + nombres)
3. **Hero** — fond `--beige`, badge, H1 avec mot en `--terracotta`, sous-titre, CTA primaire, micro-copy, icônes de confiance
4. **Vidéo** — section vidéo avec thumbnail custom, play button overlay
5. **Problème** — H2, liste de pain points avec icônes, outro encadré beige
6. **Pour qui / Pas pour qui** — 2 colonnes oui/non
7. **Mid-page CTA** — rappel CTA
8. **Avant/Après** — grille 2 colonnes avec flèche au milieu
9. **Solution (méthode)** — 4 étapes numérotées en narrative scroll
10. **Créateur** — section "Qui suis-je", avatar, texte personnel, citation
11. **Témoignages** — avis de vrais clients (avec mention "retours réels")
12. **Pricing** — card centrée avec mockup produit, prix, ROI calculator, garantie, CTA
13. **FAQ** — accordéon JS (click toggle)
14. **Final CTA** — section fond `--brown`, H2, CTA terracotta
15. **Footer** — fond `--brown`, liens légaux, copyright

L'ordre peut varier mais le Hero + Final CTA sont obligatoires.

---

## Tracking

### Umami (recommandé, zéro cookie)
- Script externe autorisé sur toutes les pages
- Snippet dans `<head>` : `<script defer src="https://cloud.umami.is/script.js" data-website-id="9ddbd906-f59d-4d0f-8fcc-42e3ae7f4f31"></script>`
- Zéro cookie → pas de bandeau RGPD nécessaire (juste mention dans la politique de confidentialité)
- Indépendant de Google (pas de GTM, pas de GA4, pas de Google Ads)

### Événements trackés
- Pageview (automatique via Umami) sur toutes les pages
- Clic CTA : `umami.track('cta_click')` (event listener sur les CTA)
- Conversion achat : `umami.track('purchase', { product: 'guide-express', revenue: 39 })` sur confirmation.html

### API (pour analyse côté VPS → LLM)
- Endpoint : `https://api.umami.is/v1/websites/{websiteId}/stats` avec un API Key
- Permet d'exporter stats/événements en JSON pour les traiter avec un LLM (pipeline VPS)

---

## Conventions de code

### Templates (njk)
- `lang="fr"` via `base.njk`, meta via `head.njk`
- Nommage des classes : BEM simplifié (`.section-element`)
- Commentaires de séparation : `<!-- ───── NOM SECTION ───── -->` et `/* ───── NOM SECTION ───── */`
- Héritage : pages → `{% extends "../_layouts/<layout>.njk" %}` ; styles page dans block `headExtra`
- Sémantique : `<section>`, `<footer>`, `<nav>`

### CSS
- Variables CSS dans `:root` (pas de valeurs magiques en dur)
- Desktop-first avec `@media (max-width: XXpx)` pour les breakpoints
- Breakpoints : adapter au contenu (540px, 600px, 680px)
- Pas de `!important` sauf cas extrême
- `clamp()` pour les tailles de titres
- Transitions : `all 0.2s` pour les hovers, `0.35s ease` pour les accordéons

### JavaScript
- Vanilla JS uniquement, centralisé dans `src/js/main.js` (chargé defer sur toutes les pages)
- Guards par présence d'élément (le fichier tourne sur toutes les pages sans erreur)
- FAQ : toggle de classe `.open` sur click
- Sticky CTA : `IntersectionObserver` sur le hero
- Tracking CTA : attributs `data-track` / `data-track-props` + addEventListener (zéro onclick inline)
- Pas de jQuery, pas de librairies externes

---

## Règles de copywriting

### Ton et voix
- **Tutoiement** systématique (sauf formation couples = vouvoiement)
- Ton chaleureux, déculpabilisant, bienveillant
- Phrases courtes, ponctuation standard
- Métaphores accessibles (boussole, photo, lampe torche)

### Interdits absolus
- Garantie : 14 jours légaux inconditionnels (droit de rétractation L221-18 C. conso.) + garantie commerciale 30 jours conditionnelle en bonus ("si tu poses le système et que ton mois ne change pas, je te rembourse"). L'ancienne règle "jamais satisfait ou remboursé" est illégale (L221-18 + ordonnance 2026-2 du 05/01/2026, fonction de rétractation en ligne obligatoire depuis le 19/06/2026, sanction 75 000€ pour personne morale). Amendée le 2026-08-31 après audit juridique deepsearch.
- Jamais de témoignages fictifs
- Pas de tirets cadratins, pas de caractères décoratifs IA
- Pas de tics IA : "il est essentiel", "dans un monde où", "en conclusion", "n'hésitez pas"
- Pas de manipulation par la peur, pas de fausse urgence
- Pas d'emoji dans le copywriting (sauf icônes de cards en HTML)

### Structure du message
- Hook émotionnel en première ligne du hero
- Structure : Message → Bénéfice → Solution
- 1 page = 1 produit = 1 action souhaitée
- CTA clair et actionnable ("Je reprends mon budget en main", pas "En savoir plus")

---

## Produits et pages

Config des produits : `src/_data/site.json` (prix, liens, `publishPage`). Pages : `src/pages/*.njk`.

| Page générée | Produit | Prix lancement/régulier | publishPage | Lien Podia |
|---|---|---|---|---|
| `guide-express.html` | Guide Express MBS | 39€ / 59€ (jusqu'au 15/10/2026) | true | `guide-express-notion/buy` |
| (hors build, redirect Podia) | Budget à Deux Simplement | 69€ / 79€ | false | `mon-budget-a-deux-simplement/buy` |
| (hors build, redirect Podia) | Pack Freelance | 97€ / 117€ | false | `pack-tresorerie-freelance/buy` |
| `confirmation.html` | Page post-paiement | — | — | routing dynamique via `products[]` |

Pages hors build (non migrées, redirigées via netlify.toml) : `budget-a-deux.html`, `runway.html` à la racine.

---

## Déploiement

- **Plateforme** : Netlify
- **Domaine** : `www.monbudgetsimple.fr` (CNAME sur Hostinger → Netlify)
- **SSL** : automatique via Netlify (Let's Encrypt)
- **Deploy** : push sur `main` → déploiement automatique
- **Config** : `netlify.toml` à la racine

---

## Responsive

- Desktop-first
- Contenu lisible et utilisable sur mobile (testé à 375px)
- Grids passent en single-column sous 540px-680px
- CTA assez gros pour le pouce (min 48px de hauteur)
- Sticky CTA mobile obligatoire

---

## Performance

- Pas d'images lourdes → emojis ou SVG inline
- Google Fonts avec `preconnect`
- Seul JS externe : Umami (chargé defer, ne bloque pas le rendu)
- Fichier unique = 0 requête HTTP supplémentaire (hors fonts + Umami)
- Objectif : < 50 KB par page (hors fonts et Umami)

---

## Workflow

### Modifier une valeur métier (prix, lien, date, légal)
1. Éditer `src/_data/site.json`
2. `npm run verify` (build + tests)

### Créer une nouvelle landing produit
1. Ajouter l'objet produit dans `site.json` (schéma homogène : slug, name, title, tagline, priceLaunch, priceRegular, dateLimit, stripeLink, podiaLink, publishPage)
2. Créer `src/pages/<slug>.njk` avec `{% extends "../_layouts/product.njk" %}` + front matter `productSlug`
3. Écrire la copy dans les blocks `productHero` / `productSections`, CTA via `{% cta product, 'position', 'label' %}`
4. `npm run verify`
5. Push sur `main` → déploiement Netlify automatique

### Modifier la copy d'une page existante
1. Éditer le fichier `.njk` correspondant dans `src/pages/`
2. Ne pas mettre de valeur métier en dur (site.json fait foi)
3. `npm run verify`

---

## Ce que Claude doit TOUJOURS faire

- Utiliser les variables CSS existantes, jamais de couleurs en dur
- Respecter le ton MBS (chaleureux, pas de manipulation)
- Produire du HTML valide et accessible
- Garder les meta tags (title, description, viewport, charset) via `head.njk`
- Mettre toute valeur métier dans `src/_data/site.json`
- Lancer `npm run verify` après chaque modification

## Ce que Claude ne doit JAMAIS faire

- Ajouter un framework CSS ou JS
- Utiliser des scripts externes (sauf Umami via `head.njk`)
- Écrire "Satisfait ou remboursé" ou inventer des témoignages
- Utiliser des tirets cadratins ou du langage "IA"
- Mettre du JS inline (`onclick`, `onsubmit`) ou du JS de page hors `src/js/main.js`
- Mettre une valeur métier (prix, lien, SIRET, email) en dur dans un template
- Utiliser les placeholders `[STRIPE_LINK]` / `[DATE_LIMITE]` (ils n'existent plus : variables + shortcode `{% cta %}`)
- Modifier la palette de couleurs sans demander
- Mettre le tag de conversion Google Ads dans GTM (plus aucun tag Google, tracking = Umami)

---

## SoloCraft

### stack
Eleventy v3 (SSG Node), Nunjucks, data-driven via `src/_data/site.json`, CSS custom properties (`src/css/styles.css`), vanilla JS (`src/js/main.js`), Google Fonts (DM Serif Display, Inter), Umami tracking, Stripe Payment Links, Jest pour les tests, Netlify pour le déploiement.

### target
B2C éducation financière en français. Produits digitaux (formations complètes) hébergés sur Podia, vendus via Stripe Payment Links, prix 39-97€. Cible : particuliers francophones. Stade : lancement, 0 client.

### constraints
- Source de vérité unique : `src/_data/site.json` (prix, liens, produits, légal)
- Pas de framework CSS ou JS, pas de bundler
- Zéro JS inline : logique dans `src/js/main.js`, tracking via attributs `data-track`
- Variables CSS existantes dans :root, jamais de couleurs en dur
- Pas de nouvelles variables CSS sans raison explicite
- Jamais de témoignages fictifs. Garantie : 14j légaux + 30j conditionnelle (voir Interdits absolus).
- Tutoiement (sauf formation couples = vouvoiement)
- Pas de tirets cadratins, pas de langage "IA"
- Événement `purchase` Umami sur confirmation avec garde `session_id` (anti faux positifs)
- Tests obligatoires : `npm run verify` après chaque modification

### high-risk-zones
- confirmation.html — page post-paiement, événement `purchase` Umami, lien Podia. Toute casse = perte de conversions trackées
- Variables CSS :root — cascade sur tout le design, une modification impacte toutes les pages
- Liens Stripe Payment Links dans les CTA — mauvais lien = conversion perdue
- netlify.toml — config de déploiement et headers sécurité

### decisions-dir
docs/decisions/
