# ADR-002: Architecture Landing Pages MBS

## Statut
Accepté — 2026-04-04

## Contexte
Mon Budget Simple (MBS) vend des formations d'éducation financière (39-97€) hébergées sur Podia. Le site vitrine et le blog sont sur www.monbudgetsimple.fr (Podia). Les landing pages de vente sur Podia sont limitées (drag and drop, peu de liberté, tracking cassé). Il faut des landing pages performantes pour les campagnes Google Ads avec un tracking fiable.

## Décision
Landing pages en HTML statique sur Netlify (go.monbudgetsimple.fr), paiement via Stripe Payment Links, formations livrées via Podia (lien d'inscription gratuit sur la page de confirmation).

### Stack retenue
- **Landing pages** : HTML5 inline (CSS + JS dans le même fichier), déployées sur Netlify
- **Paiement** : Stripe Payment Links (pas d'API, pas de backend)
- **Livraison** : Lien Podia sur la page de confirmation (le client s'inscrit lui-même)
- **Tracking** : GTM (seul script externe) + Google Ads conversion tag inline sur confirmation.html
- **Email** : ActiveCampaign
- **Blog/vitrine** : Podia (www.monbudgetsimple.fr)

### Alternatives écartées

| Alternative | Raison du rejet |
|---|---|
| Systeme.io (all-in-one) | Moins de contrôle sur les landing pages et le tracking. Viable mais ne maximise pas le Quality Score Google Ads. |
| Next.js / Astro | Overkill pour 3 pages statiques. Build step, npm, dépendances = maintenance inutile pour un solo founder. |
| Podia checkout natif | Pas de tracking GTM possible sur le checkout Podia. Tracking Google Ads conversion impossible. |
| Stripe Checkout Sessions (API) | Nécessite un backend pour créer les sessions. Payment Links suffisent pour des prix fixes. |
| Bridge Stripe → Podia (webhook) | Complexité inutile à 0 ventes. Le lien Podia sur la page de confirmation est suffisant. |

### Flow d'achat
1. Google Ads / SEO → landing page (go.monbudgetsimple.fr)
2. Clic CTA → Stripe Payment Link
3. Paiement → redirection vers confirmation.html
4. Page de confirmation : lien Podia + conversion tracking
5. Email ActiveCampaign avec lien Podia (backup)

### Livraison post-paiement (Option C)
Le client accède à sa formation via un lien d'inscription gratuit Podia affiché sur la page de confirmation. Pas de webhook, pas d'API, pas de bridge. Le risque de fuite du lien est négligeable à faible volume (URL non indexée, non publiée).

## Trigger de migration
- **> 8 landing pages** : envisager un static site generator (Astro/11ty) pour mutualiser les composants
- **> 50 ventes/mois** : automatiser l'enrollment Podia via Make.com (Stripe webhook → Podia API)
- **Besoin de TVA multi-pays** : migrer vers Stripe Tax ou LemonSqueezy/Paddle (Merchant of Record)

## Conséquences
- Chaque page est un fichier HTML autonome — pas de composants partagés
- Le tracking Google Ads conversion est inline (pas dans GTM) pour éviter les race conditions
- Deux scripts externes autorisés : GTM (toutes les pages) et gtag.js (confirmation.html uniquement, nécessaire pour le tag de conversion Google Ads inline)
- Podia n'est plus utilisé pour la vente, seulement pour l'hébergement des cours et le site vitrine
