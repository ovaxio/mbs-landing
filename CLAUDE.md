# CLAUDE.md — Projet Landing Pages MBS (Mon Budget Simple)

## Projet

Repo de landing pages HTML pour Mon Budget Simple, un business d'éducation financière en français.
Les landing pages sont hébergées sur Netlify (go.monbudgetsimple.fr), séparées du site vitrine Podia (www.monbudgetsimple.fr).

### Architecture

```
go.monbudgetsimple.fr (Netlify)        → Landing pages de vente + confirmation
Stripe Payment Links                   → Paiement direct, codes promo
www.monbudgetsimple.fr (Podia)         → Site vitrine + blog SEO + hébergement cours
ActiveCampaign                         → Email marketing
GTM + GA4 + Google Ads                 → Tracking (sur les landing pages uniquement)
```

### Flow d'achat

1. Client arrive sur `go.monbudgetsimple.fr/guide-express` (landing page)
2. Clic CTA → Stripe Payment Link (paiement hébergé par Stripe)
3. Après paiement → `go.monbudgetsimple.fr/confirmation` (page de confirmation)
4. Page de confirmation : lien d'accès Podia + conversion tracking Google Ads
5. Email ActiveCampaign envoyé en parallèle avec le lien Podia

### Livraison des formations

Les formations sont hébergées sur Podia. Après paiement Stripe, le client accède à sa formation via un lien d'inscription gratuit Podia affiché sur la page de confirmation.
Pas de bridge technique (webhook/API) — le client s'inscrit lui-même sur Podia.
Quand le volume dépasse 50 ventes/mois, automatiser via Make.com (Stripe webhook → Podia API).

---

## Stack technique

- **HTML5** — fichiers single-page, JS inline, CSS partagé dans `styles.css` + styles page-spécifiques inline
- **CSS** — `styles.css` (design system partagé) + `<style>` inline pour les styles propres à chaque page. Custom properties (variables CSS), pas de framework CSS
- **JS** — vanilla uniquement, pas de dépendances, pas de bundler
- **Fonts** — Google Fonts via CDN : `DM Serif Display` (titres), `Inter` (body)
- **Tracking** — GTM + gtag.js (seuls scripts externes autorisés) + Google Ads conversion tag inline sur confirmation.html
- **Déploiement** — Netlify, domaine `go.monbudgetsimple.fr`
- **Paiement** — Stripe Payment Links (pas d'API, pas de backend)
- **Pas de** : React, npm, build step, SCSS, PostCSS, Node.js, framework CSS

---

## Design System MBS

### Palette couleurs

```css
:root {
  --beige: #F2EBE0;
  --brown: #2C1F14;
  --gold: #C4A882;
  --terracotta: #C4614A;
  --terracotta-dark: #A8503D;
  --white: #FEFCF9;
  --light-gold: #D4BFA0;
  --soft-bg: #FAF7F3;
  --text-secondary: #5C4A3A;
  --text-tertiary: #8A7565;
  --before-bg: #FDF3F1;
  --muted: #D4C4B8;
}
```

### Couleurs sémantiques

| Rôle | Variable | Usage |
|---|---|---|
| Texte principal | `--brown` | Titres, corps de texte |
| Texte secondaire | `--text-secondary` | Sous-titres, descriptions, paragraphes |
| Texte tertiaire | `--text-tertiary` | Micro-copy, légendes, prix barrés |
| Accent primaire | `--terracotta` | CTA, highlights, chiffres clés |
| Accent secondaire | `--gold` | Badges, décorations, séparateurs, FAQ toggles, checkmarks positifs |
| Fond clair | `--beige` | Hero, sections alternées |
| Fond subtil | `--soft-bg` | Cards, sections alternées, colonne "après" |
| Fond sombre | `--brown` | Topbar, footer, section finale CTA |
| Fond "avant" | `--before-bg` | Colonne "avant" dans les sections avant/après |
| Élément muet | `--muted` | Bordures discrètes, section "pas pour toi" |

### Typographie

- **Titres** (h1, h2, h3) : `'DM Serif Display', serif` — font-weight: 400, line-height: 1.25
- **Corps** : `'Inter', -apple-system, sans-serif` — font-size: 17px, line-height: 1.7
- **H1** : `clamp(2.2rem, 6.5vw, 3.6rem)`
- **H2** : `clamp(1.6rem, 4vw, 2.2rem)`
- **Échelle body** : 0.78rem (micro) → 0.85rem (small) → 0.95rem (secondary) → 1rem (body) → 1.1rem (emphasis)

### Composants récurrents

#### CTA primaire
```css
.cta-primary {
  display: inline-block;
  background: var(--terracotta);
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 18px 44px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(196,97,74,0.25);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.cta-primary:hover {
  background: var(--terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(196,97,74,0.35);
}
```

#### Badge
```css
.badge {
  display: inline-block;
  background: var(--gold);
  color: var(--brown);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 18px;
  border-radius: 20px;
}
```

#### Cards
- Background : `var(--white)` ou `var(--soft-bg)`
- Border-radius : 12px-14px
- Box-shadow : `0 1px 6px rgba(44,31,20,0.05)`
- Padding : 22px-32px

#### Sticky mobile CTA
Toutes les landing pages doivent inclure un CTA sticky en bas sur mobile (apparaît au scroll après le hero).

### Espacements

- Padding vertical des sections : `72px 24px`
- `.container` : `max-width: 760px; margin: 0 auto; padding: 0 24px`
- Gap grids : 18px-28px

---

## Structure type d'une landing page

Chaque landing page suit cette structure de sections (dans l'ordre) :

1. **Topbar** — barre de confiance sombre (`--brown`), une ligne de texte
2. **Hero** — fond `--beige`, badge, H1 avec mot en `--terracotta`, sous-titre, CTA primaire, micro-copy
3. **Social proof bar** — chiffres clés (icônes + nombres)
4. **Problème** — H2, liste de pain points (bullets gold), outro encadré beige
5. **Avant/Après** — grille 2 colonnes avec flèche au milieu
6. **Solution (méthode)** — 3 étapes numérotées en cards
7. **Mid-page CTA** — rappel CTA
8. **Contenu du produit** — grille de cards avec icônes emoji
9. **Créateur** — section "Qui suis-je", avatar, texte personnel
10. **Pour qui / Pas pour qui** — 2 colonnes oui/non
11. **Pricing** — card centrée avec prix, liste de features, CTA. Lien → Stripe Payment Link
12. **FAQ** — accordéon JS (click toggle)
13. **Final CTA** — section fond `--brown`, H2, CTA terracotta
14. **Footer** — fond `--brown`, liens légaux, copyright

L'ordre peut varier mais le Hero + Final CTA sont obligatoires.

---

## Tracking

### GTM (Google Tag Manager)
- Script externe autorisé sur toutes les landing pages
- Snippet dans `<head>` + `<noscript>` après `<body>`
- GA4 et tout autre pixel configurés dans le dashboard GTM
- Placeholder : `GTM-XXXXXXX`

### Google Ads Conversion
- Tag de conversion placé en INLINE sur `confirmation.html` uniquement
- NE PAS passer par GTM pour le tag de conversion Google Ads (race condition)
- Utiliser `gtag()` en script synchrone

### Événements trackés
- Pageview (via GTM/GA4) sur toutes les pages
- Clic CTA (via GTM, event listener)
- Conversion achat (inline sur confirmation.html)

---

## Conventions de code

### HTML
- `lang="fr"` obligatoire
- Meta viewport et description toujours présents
- Nommage des classes : BEM simplifié (`.section-element`)
- Commentaires de séparation : `<!-- ───── NOM SECTION ───── -->`
- Commentaires CSS de séparation : `/* ───── NOM SECTION ───── */`
- Commentaires pour les placeholders : `<!-- STRIPE_LINK: ... -->`, `<!-- PODIA_LINK: ... -->`, `<!-- CONVERSION: ... -->`
- Sémantique : `<section>`, `<footer>`, `<nav>`

### CSS
- Variables CSS dans `:root` (pas de valeurs magiques en dur)
- Desktop-first avec `@media (max-width: XXpx)` pour les breakpoints
- Breakpoints : adapter au contenu (540px, 600px, 680px)
- Pas de `!important` sauf cas extrême
- `clamp()` pour les tailles de titres
- Transitions : `all 0.2s` pour les hovers, `0.35s ease` pour les accordéons

### JavaScript
- Vanilla JS uniquement, dans `<script>` en bas du fichier
- FAQ : toggle de classe `.open` sur click
- Sticky CTA : `IntersectionObserver` sur le hero
- Pas de jQuery, pas de librairies externes
- `addEventListener`, pas de `onclick` inline

---

## Règles de copywriting

### Ton et voix
- **Tutoiement** systématique (sauf formation couples = vouvoiement)
- Ton chaleureux, déculpabilisant, bienveillant
- Phrases courtes, ponctuation standard
- Métaphores accessibles (boussole, photo, lampe torche)

### Interdits absolus
- Jamais "Satisfait ou remboursé" (décision business)
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

| Page | Produit | Prix | Cible | Stripe Link | Podia Link |
|---|---|---|---|---|---|
| `guide-express.html` | Guide Express MBS | 39€ (prix barré 49€, coupon MBS-DEPART pré-appliqué via Stripe) | Généralistes | TODO | TODO |
| `budget-a-deux.html` | Formation "Budget à deux" | 69€ | Couples | TODO | TODO |
| `pack-freelance.html` | Pack Freelance | 97€ | Freelances | TODO | TODO |
| `confirmation.html` | Page post-paiement | — | Tous | — | TODO |

---

## Déploiement

- **Plateforme** : Netlify
- **Domaine** : `go.monbudgetsimple.fr` (CNAME sur Hostinger → Netlify)
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
- Seul JS externe : GTM (chargé async, ne bloque pas le rendu)
- Fichier unique = 0 requête HTTP supplémentaire (hors fonts + GTM)
- Objectif : < 50 KB par page (hors fonts et GTM)

---

## Workflow

### Créer une nouvelle landing page
1. Copier `_template.html` et renommer (ex: `guide-express.html`)
2. Remplacer le contenu placeholder (hero, problème, solution, pricing, FAQ)
3. Ajouter les styles page-spécifiques dans le `<style>` inline (les styles partagés sont dans `styles.css`)
4. Remplacer `<!-- STRIPE_LINK -->` par le vrai Stripe Payment Link
5. Mettre à jour `confirmation.html` si besoin (nouveau lien Podia, nouveau prix de conversion)
6. Vérifier les variables CSS (ne pas en ajouter de nouvelles sans raison)
7. Tester responsive à 375px, 768px, 1440px
8. Vérifier tous les liens (CTA → bon Stripe Payment Link)
9. Valider le copywriting (relire les interdits)
10. Push sur `main` → déploiement Netlify automatique

### Modifier une page existante
1. Lire le fichier complet avant de modifier
2. Ne pas casser la structure des sections
3. Garder la cohérence avec le design system
4. Tester le responsive après modification

---

## Ce que Claude doit TOUJOURS faire

- Utiliser les variables CSS existantes, jamais de couleurs en dur
- Respecter le ton MBS (chaleureux, pas de manipulation)
- Produire du HTML valide et accessible
- Inclure les meta tags (title, description, viewport, charset)
- Garder tout inline (CSS + JS dans le même fichier HTML)
- Tester mentalement le responsive
- Mettre des commentaires placeholder pour les liens Stripe et Podia

## Ce que Claude ne doit JAMAIS faire

- Ajouter un framework CSS ou JS
- Utiliser des scripts externes (sauf GTM et gtag.js sur confirmation.html)
- Écrire "Satisfait ou remboursé" ou inventer des témoignages
- Utiliser des tirets cadratins ou du langage "IA"
- Créer des fichiers JS séparés pour du code page-spécifique (JS de page reste inline dans chaque HTML). Exception : les scripts partagés entre plusieurs pages (ex: `consent.js`, `gtm-init.js`) peuvent être extraits dans un fichier JS dédié chargé via `<script src="...">` dans le `<head>`.
- Créer de nouveaux fichiers CSS (le design system partagé est dans `styles.css`, les styles page-spécifiques restent inline). Exception : les styles partagés entre plusieurs pages peuvent être mutualisés dans `styles.css`.
- Modifier la palette de couleurs sans demander
- Mettre le tag de conversion Google Ads dans GTM (doit rester inline)

---

## SoloCraft

### stack
HTML5 single-page files (tout inline : CSS + JS), custom properties CSS, vanilla JS, Google Fonts (DM Serif Display, Inter), GTM pour le tracking, Stripe Payment Links, Netlify pour le déploiement. Pas de build step, pas de bundler, pas de npm.

### target
B2C éducation financière en français. Produits digitaux (formations complètes) hébergés sur Podia, vendus via Stripe Payment Links, prix 39-97€. Cible : particuliers francophones. Stade : lancement, 0 client.

### constraints
- Pas de framework CSS ou JS
- Pas de dépendances externes (sauf Google Fonts + GTM)
- Code page-spécifique inline dans chaque HTML. Code partagé entre plusieurs pages : CSS dans `styles.css`, JS dans un fichier partagé dédié (ex: `consent.js`)
- Variables CSS existantes dans :root, jamais de couleurs en dur
- Pas de nouvelles variables CSS sans raison explicite
- Jamais "Satisfait ou remboursé" ni témoignages fictifs
- Tutoiement (sauf formation couples = vouvoiement)
- Pas de tirets cadratins, pas de langage "IA"
- Tag de conversion Google Ads inline sur confirmation.html, jamais dans GTM

### high-risk-zones
- confirmation.html — page post-paiement, conversion tracking Google Ads, lien Podia. Toute casse = perte de conversions trackées
- Variables CSS :root — cascade sur tout le design, une modification impacte toutes les pages
- Liens Stripe Payment Links dans les CTA — mauvais lien = conversion perdue
- netlify.toml — config de déploiement et headers sécurité

### decisions-dir
docs/decisions/
