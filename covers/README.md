# covers/ — couvertures typographiques MBS

Remplace la génération d'illustrations par IA (décision du 2026-08-27, voir `../BRAND.md` §5).
Les tokens sont copiés en tête de `cover.html` depuis `../brand.tokens.json` — **ne jamais les faire diverger**.

## Deux formats, et deux seulement

| Format | Taille | Usage |
|---|---|---|
| `featured` | 1600 × 900 | Image à la une de l'article (Podia, onglet Details) et image sociale Open Graph |
| `social` | 1080 × 1080 | Post Instagram |

**Pas d'images de corps d'article.** Une carte typographique au milieu d'un texte répète le texte.

## Écrire une ligne de couverture

La ligne n'est **pas** le titre de l'article — sur Podia le titre s'affiche juste sous l'image, et le
répéter fait doublon. La ligne porte la phrase contre-intuitive : le déplacement de cause, pas le sujet.

- ❌ « La méthode des enveloppes »
- ✅ « Ce n’est pas le montant qui dérape. *C’est la case*. »

Règles :
- **12 mots maximum.** Au-delà, le texte descend sous 100 px et ne tient plus en vignette.
- Les astérisques mettent un segment en terracotta : `*ce segment*`. **Un seul segment par ligne**,
  celui qui porte le retournement.
- Apostrophes typographiques (`’`), jamais droites. Espace insécable avant `%`, `:`, `?`, `!`.
- `"bg": "soft"` alterne le fond sur `--soft-bg` — à utiliser une couverture sur trois environ,
  pour que la grille du blog ne soit pas plate.

## Générer

```bash
node build.mjs covers.json out
```

Nécessite `playwright` et un Chromium. Si Chromium est déjà présent ailleurs :
`MBS_CHROMIUM=/chemin/vers/chrome node build.mjs covers.json out`

Les sorties sont nommées `<slug>_featured.png` et `<slug>_social.png`, exactement ce qu'attend
le skill `podia-publish`.
