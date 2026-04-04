# CLAUDE.md — Projet Landing Pages MBS (Mon Budget Simple)

## Projet

Repo de landing pages HTML standalone pour Mon Budget Simple, un business d'éducation financière en français.
Chaque page est un fichier `.html` autonome (HTML + CSS + JS inline, pas de framework, pas de build step).
Les pages sont ensuite hébergées sur Podia ou servies en standalone.

---

## Stack technique

- **HTML5** — fichiers single-page, tout inline (style + script dans le même fichier)
- **CSS** — custom properties (variables CSS), pas de framework CSS, pas de Tailwind
- **JS** — vanilla uniquement, pas de dépendances, pas de bundler
- **Fonts** — Google Fonts via CDN : `DM Serif Display` (titres), `Inter` (body)
- **Pas dep** : React, npm, build step, SCSS, PostCSS, images locales (tout en emoji/SVG inline)

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
  --white: #FFFFFF;
  --light-gold: #D4BFA0;
  --soft-bg: #FAF7F3;
}
```

### Couleurs sémantiques

| Rôle              | Variable              | Usage                                         |
| ----------------- | --------------------- | --------------------------------------------- |
| Texte principal   | `--brown`             | Titres, corps de texte                        |
| Texte secondaire  | `#5C4A3A`             | Sous-titres, descriptions                     |
| Texte tertiaire   | `#8A7565`             | Micro-copy, légendes, prix barrés             |
| Accent primaire   | `--terracotta`        | CTA, highlights, chiffres clés                |
| Accent secondaire | `--gold`              | Badges, décorations, séparateurs, FAQ toggles |
| Fond clair        | `--beige`             | Hero, sections alternées                      |
| Fond subtil       | `--soft-bg` (#FAF7F3) | Cards, sections alternées                     |
| Fond sombre       | `--brown`             | Topbar, footer, section finale CTA            |

### Typographie

- **Titres** (h1, h2, h3) : `'DM Serif Display', serif` — font-weight: 400, line-height: 1.25
- **Corps** : `'Inter', -apple-system, sans-serif` — font-size: 17px, line-height: 1.7
- **H1** : `clamp(2rem, 5.5vw, 3.2rem)`
- **H2** : `clamp(1.6rem, 4vw, 2.2rem)`
- **Micro-copy** : 0.78rem–0.88rem

### Composants récurrents

#### CTA primaire
```css
.cta-primary {
  display: inline-block;
  background: var(--terracotta);
  color: var(--white);
  font-size: 1.08rem;
  font-weight: 600;
  padding: 18px 44px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(196,97,74,0.25);
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
  color: var(--white);
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
- Border-radius : 12px–14px
- Box-shadow : `0 1px 6px rgba(44,31,20,0.05)`
- Padding : 22px–32px

#### Sticky mobile CTA
Toutes les pages doivent inclure un CTA sticky en bas sur mobile (apparaît au scroll après le hero).

### Espacements

- Padding vertical des sections : `72px 24px`
- `.container` : `max-width: 760px; margin: 0 auto; padding: 0 24px`
- Gap grids : 18px–28px

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
11. **Pricing** — card centrée avec prix, liste de features, garanties
12. **FAQ** — accordéon JS (click toggle)
13. **Final CTA** — section fond `--brown`, H2, CTA terracotta
14. **Footer** — fond `--brown`, liens légaux, copyright

L'ordre peut varier mais le Hero + Final CTA sont obligatoires.

---

## Conventions de code

### HTML
- `lang="fr"` obligatoire
- Meta viewport et description toujours présents
- Nommage des classes : BEM simplifié (`.section-element`, pas de double underscore)
- Commentaires de séparation entre sections : `<!-- ───── NOM SECTION ───── -->`
- Commentaires CSS de séparation : `/* ───── NOM SECTION ───── */`
- Sémantique : `<section>`, `<footer>`, `<nav>` quand pertinent

### CSS
- Variables CSS dans `:root` (pas de valeurs magiques en dur)
- Mobile-first n'est PAS la convention actuelle → desktop-first avec `@media (max-width: XXpx)` pour les breakpoints
- Breakpoints utilisés : `600px`, `540px`, `680px` (pas de système rigide, adapter au contenu)
- Pas de `!important` sauf cas extrême
- Utiliser `clamp()` pour les tailles de titres
- Transitions : `all 0.2s` pour les hovers, `0.35s ease` pour les accordéons

### JavaScript
- Vanilla JS uniquement, en bas du fichier dans une balise `<script>`
- Pattern FAQ : toggle de classe `.open` sur click
- Pattern sticky CTA : `IntersectionObserver` sur le hero
- Pas de jQuery, pas de librairies externes
- Event listeners avec `addEventListener`, pas de `onclick` inline

---

## Règles de copywriting

### Ton & voix
- **Tutoiement** systématique (sauf formation couples = vouvoiement)
- Ton chaleureux, déculpabilisant, bienveillant
- Phrases courtes, ponctuation standard
- Métaphores accessibles (boussole, photo, lampe torche)

### Interdits absolus
- ❌ Jamais "Satisfait ou remboursé" (décision business)
- ❌ Jamais de témoignages fictifs
- ❌ Pas de tirets cadratins (—), pas de caractères décoratifs IA
- ❌ Pas de tics IA : "il est essentiel", "dans un monde où", "en conclusion", "n'hésitez pas"
- ❌ Pas de manipulation par la peur, pas de faux urgence, pas de guru marketing
- ❌ Pas d'emoji dans le copywriting (sauf icônes de cards en HTML)

### Structure du message
- Hook émotionnel en première ligne du hero
- Structure : **Message → Bénéfice → Solution**
- 1 page = 1 produit = 1 action souhaitée
- CTA clair et actionnable ("Je reprends mon budget en main", pas "En savoir plus")

---

## Produits & pages existantes

| Page                         | Produit                   | Prix                            | Cible        |
| ---------------------------- | ------------------------- | ------------------------------- | ------------ |
| `guide-express-landing.html` | Guide Express MBS         | 49€ (promo 39€ code MBS-DEPART) | Généralistes |
| (à créer)                    | Formation "Budget à deux" | 69€                             | Couples      |
| (à créer)                    | Pack Freelance            | 97€                             | Freelances   |

### URLs de destination (Podia)
- Guide Express : `/reprendre-son-budget` (49€) ou `/reprendre-son-budget-promo` (39€)
- Formation couples : `/mon-budget-a-deux-simplement`
- Pack freelance : `/budget-freelance-serein`
- Lead magnet couples : `https://tally.so/r/nWGyMR`

---

## Responsive

- Desktop-first
- Le contenu est lisible et utilisable sur mobile (testé à 375px)
- Grids passent en single-column sous 540px–680px
- Les CTA sont assez gros pour être tapables au pouce (min 48px de hauteur)
- Sticky CTA mobile obligatoire (apparaît après scroll passé le hero)

---

## Performance

- Pas d'images lourdes → emojis ou SVG inline pour les icônes
- Google Fonts chargées avec `preconnect`
- Pas de JS externe
- Fichier unique = 0 requête HTTP supplémentaire (hors fonts)
- Objectif : < 50 KB par page (hors fonts)

---

## Workflow

### Créer une nouvelle landing page
1. Copier `guide-express-landing.html` comme template
2. Adapter le contenu (hero, problème, solution, pricing, FAQ)
3. Vérifier les variables CSS (ne pas en ajouter de nouvelles sans raison)
4. Tester responsive à 375px, 768px, 1440px
5. Vérifier tous les liens (CTA → bonne URL Podia)
6. Valider le copywriting (relire les interdits ci-dessus)

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
- Tester mentalement le responsive (les grids doivent passer en 1 colonne sur mobile)

## Ce que Claude ne doit JAMAIS faire

- Ajouter un framework CSS ou JS
- Utiliser des images externes (sauf Google Fonts)
- Écrire "Satisfait ou remboursé" ou inventer des témoignages
- Utiliser des tirets cadratins ou du langage "IA"
- Créer des fichiers séparés (CSS, JS) — tout reste dans le HTML
- Modifier la palette de couleurs sans demander

---

## SoloCraft

### stack
HTML5 single-page files (tout inline : CSS + JS), custom properties CSS (pas de framework), vanilla JS, Google Fonts (DM Serif Display, Inter), hébergé sur Podia. Pas de build step, pas de bundler, pas de npm.

### target
B2C éducation financière en français. Produits digitaux (guides, formations) vendus sur Podia, prix 39-97€. Cible : particuliers francophones (généralistes, couples, freelances). Stade : lancement, 1 produit live + 2 à créer.

### constraints
- Pas de framework CSS ou JS (pas de Tailwind, React, jQuery, etc.)
- Pas de dépendances externes (sauf Google Fonts)
- Tout reste inline dans un seul fichier HTML par page (CSS + JS)
- Utiliser les variables CSS existantes dans :root, jamais de couleurs en dur
- Pas de nouvelles variables CSS sans raison explicite
- Jamais écrire "Satisfait ou remboursé" ni inventer de témoignages
- Respecter le tutoiement (sauf formation couples = vouvoiement)
- Pas de tirets cadratins, pas de langage "IA", pas d'emoji dans le copywriting

### high-risk-zones
- guide-express-landing.html (quand il existera) — page de vente live, toute casse = perte de revenus directs
- Variables CSS :root dans chaque fichier HTML — cascade sur tout le design system, une modification impacte toute la page
- URLs Podia dans les CTA — mauvais lien = conversion perdue, vérifier chaque href

### decisions-dir
docs/decisions/

