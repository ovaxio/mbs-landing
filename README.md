# MBS — site www.monbudgetsimple.fr

Landing pages Mon Budget Simple. Eleventy (SSG), data-driven via `src/_data/site.json`, testé (Jest), déployé sur Netlify (`dist/`).

```bash
npm ci
npm run verify   # build (eleventy) + tests (jest)
npm run dev      # serve local http://localhost:8080
```

- Contenu produit : `src/pages/*.njk` (copy FR par page)
- Config métier (prix, liens, légal) : `src/_data/site.json` (source de vérité)
- Règles de maintenance (LLM ou humain) : **CONVENTIONS.md**
- Produits non migrés (hors build, redirigés) : `budget-a-deux.html`, `runway.html`
