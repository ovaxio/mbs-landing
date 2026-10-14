# BRAND.md — charte MBS

> **Source de vérité : CE fichier, dans le vault.**
> Dernière révision : 2026-08-27. Valeurs machine : `brand.tokens.json` (même dossier, vault).
>
> **Sens de la synchronisation : le vault est l'origine, le repo est une copie.**
> Le repo de production `~/CascadeProjects/mbs/` (landing + build `covers/`) détient une copie
> de `BRAND.md` et `brand.tokens.json` **synchronisée depuis ce fichier** via
> `_meta/lib/sync-mbs-brand.sh`. Ne jamais éditer la charte directement dans le repo : la modifier
> ici, puis lancer le script de sync. En cas de divergence, c'est ce fichier vault qui fait foi.

Cette charte gouverne les trois propriétés : landing pages Netlify (`go.monbudgetsimple.fr`),
site et blog Podia (`monbudgetsimple.fr`), Instagram et reels (repo `mbs-crea`).

---

## 1. Couleurs

| Token | Hex | Rôle |
|---|---|---|
| `beige` | `#F2EBE0` | Fond principal |
| `soft-bg` | `#FAF7F3` | Fond secondaire, surfaces posées |
| `white` | `#FEFCF9` | Surface haute, blanc tiédi |
| `brown` | `#2C1F14` | Texte principal, traits, contours |
| `text-secondary` | `#5C4A3A` | Texte secondaire |
| `text-tertiary` | `#8A7565` | Légendes, labels |
| `terracotta` | `#C4614A` | Accent de marque |
| `terracotta-dark` | `#A8503D` | **Couleur d'action** (voir §2) |
| `gold` | `#C4A882` | Décoratif uniquement |
| `light-gold` | `#D4BFA0` | Décoratif, surfaces |
| `muted` | `#D4C4B8` | Séparateurs, états inactifs |
| `before-bg` | `#FDF3F1` | Fond des blocs « avant / problème » |

**Aucune autre couleur n'existe.** Pas de vert, pas de bleu, pas de dégradé, pas d'orange.

---

## 2. Couleurs sémantiques

| Usage | Token | Pourquoi |
|---|---|---|
| Bouton d'action, fond | `terracotta-dark` `#A8503D` | Texte blanc dessus = **5,41:1**, seul ton de la charte qui passe WCAG AA à toutes les tailles |
| Lien, mot surligné, filet | `terracotta` `#C4614A` | Accent de marque. **Ne porte jamais de texte blanc en taille courante** (4,07:1) |
| Texte courant | `brown` sur fond clair | 13,51:1 sur beige |
| Décor (badges, filets, aplats) | `gold`, `light-gold` | **Jamais de texte** : 1,91:1 sur beige |

---

## 3. Règles de contraste — mesurées, non négociables

1. **Texte fonctionnel** : minimum 4,5:1. Le `gold` et le `light-gold` en sont exclus par construction.
2. **Deux aplats qui se touchent** : minimum 3,0:1. En dessous, un contour `brown` de 2 à 3 px les sépare.
3. **Le `gold` n'est jamais posé nu** sur `beige` (1,91) ni sur `terracotta` (1,80). Il porte toujours un contour `brown` (7,06).
4. **Hauteur minimale d'un bouton** : 48 px. **Corps de texte mobile** : 16 px minimum.

Ratios de référence : `brown`/`beige` 13,51 · `gold`/`brown` 7,06 · `terracotta-dark`/`beige` 4,57 ·
`terracotta`/`brown` 3,93 · `terracotta`/`beige` 3,44 · `gold`/`beige` 1,91 · `gold`/`terracotta` 1,80.

---

## 4. Typographie

**Un seul couple, sur les trois propriétés : `DM Serif Display` (titres) + `Inter` (corps).**

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap">
```

| Rôle | Réglage |
|---|---|
| Titres | DM Serif Display, **graisse 400 uniquement** — la générosité vient de la taille et d'un interligne serré (0,95–1,05), jamais du gras |
| Corps | Inter 400 · emphase 500 · CTA 600 |
| Échelle corps | 0,78 / 0,85 / 0,95 / 1 / 1,1 rem — **cinq crans, pas un de plus** |
| Titres | `clamp()` |

**Playfair Display est retiré** (utilisé par Les Investisseuses, le concurrent le plus proche chromatiquement).
**Poppins est retiré** (fonte par défaut de la niche : 6 concurrents sur 12).

---

## 5. Imagerie — décision du 2026-08-27

**Pas de mascotte. Pas d'illustration générée par IA.**

Motif : le coût d'un personnage est proportionnel au nombre d'usages, et il n'existe pas de capacité
de production continue ici. Référence : Alan a laissé sa mascotte inutilisée de 2016 à 2021 faute de
pouvoir produire de nouvelles poses, avec une équipe design.

**Ce qui remplace :** des couvertures typographiques générées depuis `covers/` (voir ce dossier),
rendues à partir de ce même `styles.css`. Zéro génération, zéro dérive, zéro coût par image.

Photographie autorisée pour l'humain uniquement : portrait de Guillaume, captures de produit réelles.
Jamais de photo stock d'argent, de pièces, de tirelires ou de calculatrices.

**Interdits visuels, toutes propriétés :** dégradés · ombres portées · textures · emoji dans les
visuels · texte ou chiffre généré par une IA dans une image · icônes de banque génériques.

---

## 6. Portage Podia — manuel, à faire à la main

Podia expose 6 couleurs de base (Accent 1, Accent 2, Shade 1–4) en saisie hex, dans les réglages de
design du site. Valeurs à coller :

| Réglage Podia | Valeur |
|---|---|
| Accent 1 | `#A8503D` |
| Accent 2 | `#C4614A` |
| Shade 1 (fond) | `#FAF7F3` |
| Shade 2 | `#F2EBE0` |
| Shade 3 | `#D4C4B8` |
| Shade 4 (texte) | `#2C1F14` |

Fontes : choisir DM Serif Display + Inter si la liste Podia les propose. Sinon, documenter l'écart ici.
Non personnalisable chez Podia : couleurs du lecteur vidéo, menu de confirmation d'abonnement.

---

## 7. Décisions, et pourquoi

**2026-08-27 — l'orange `#E27B1F` sort de l'écosystème.** Trois motifs indépendants :
1. Il est à **1,04 de contraste** de l'orange `#F07708` de Budgetfacile, concurrent direct. Adopter cet orange, c'est adopter la couleur d'un concurrent.
2. Texte blanc dessus = **2,96:1** — échec WCAG AA y compris en grande taille. Les CTA actuels du site Podia sont inaccessibles.
3. Le terracotta et le brun sont, relevé à l'appui, les deux seules couleurs que personne d'autre ne porte dans la niche.

**2026-08-27 — pas de mascotte, repli typographique.** Voir §5.

**2026-08-27 — deux systèmes retirés définitivement :** la palette logo à dégradés (orange→jaune,
bleu→vert, rose→orange) et la charte Instagram Notion (vert `#bbf7d0`, bleu `#eff6ff`). Toute
référence à l'une ou l'autre est périmée.

**2026-08-27 — Qonto retiré des références :** aucune documentation de design system publique.

---

## 8. Ce qui n'est pas dans cette charte, volontairement

Pas de principes rédigés en prose, pas de gouvernance, pas de processus de contribution, pas de
versionnement sémantique, pas de changelog. Une seule personne écrit et applique cette charte.

Si elle est contournée pour publier plus vite, **c'est la charte qui a tort** : la retailler à la
baisse, ne pas la faire respecter.
