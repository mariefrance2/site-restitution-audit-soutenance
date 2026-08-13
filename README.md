# Audit de sécurité — Agent IA GLPI — Third SARL

Site de restitution du mémoire de fin d'études : audit de sécurité, Red Teaming et
remédiation d'un agent IA autonome d'affectation de tickets GLPI, développé au sein
de Third SARL (SSII, Douala, Cameroun).

Site en une seule page scrollable, construit avec **Next.js 14 (App Router)**,
**TypeScript** et **Tailwind CSS**, pensé pour tourner en local pendant la soutenance.

## Démarrage rapide

```bash
npm install
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

La zone de dépôt de rapports PDF (section 5) nécessite un jeton **Vercel Blob** —
voir [Dépôt de rapports PDF](#dépôt-de-rapports-pdf) ci-dessous. Sans ce jeton,
le reste du site fonctionne normalement, seul l'upload/listing des rapports
renverra une erreur.

Pour un build de production local :

```bash
npm run build
npm run start
```

## Structure du projet

```
app/
  layout.tsx               Layout racine, police Inter, métadonnées
  page.tsx                  Assemblage des 6 sections
  globals.css               Design tokens, styles globaux
  api/reports/route.ts      Listing (GET) et dépôt (POST) des rapports PDF
  api/agent-tests/route.ts  Exécution des scénarios de test contre l'agent local (POST)
components/
  layout/                 Navbar, Footer
  sections/               Hero + les 6 sections du site (dont StrideMatrix,
                          intégrée à Résultats des tests, et AgentTestsDashboard)
  charts/                 Graphiques (barres OWASP, donut criticité, jauge de
                          risque, comparatif avant/après, tendance)
  ui/                     KPI cards, badges de criticité (avec icône dédiée),
                          légendes, compteurs animés, bouton résumé PDF
  illustrations/          Illustrations SVG custom (hero, carte du monde stylisée)
  upload/                 Zone de dépôt et liste des rapports PDF
lib/
  data/                   Jeux de données JSON (constats, méta, outils,
                          timeline, taux d'attaque, conséquences)
  agentTests/             Scénarios de test (métadonnées publiques + payloads
                          serveur), stockage localStorage de l'historique
  exportSummary.ts        Génération du résumé exécutif PDF (jsPDF, côté client)
  types.ts                Types TypeScript partagés
  utils.ts                Fonctions utilitaires (agrégations, formatage)
```

## Données

Toutes les données des dashboards sont codées en dur dans `lib/data/*.json` :
les **16 constats réels de l'audit** (`findings.json`), les métadonnées de
catégories/criticité (`meta.json`), les outils mobilisés (`tools.json`), la
timeline de campagne (`timeline.json`), les taux de réussite d'attaque
avant/après (`attack-rates.json`) et les statistiques d'enjeux sourcées
(`consequences.json`).

Pour mettre à jour les constats avec les données définitives du mémoire, il
suffit d'éditer `lib/data/findings.json` en conservant la structure des
champs (`id`, `category`, `criticality`, `title`, `description`, `impact`,
`tool`, `statusBefore`, `remediation`, `statusAfter`, `remediated`,
`dateFound`, `dateRemediated`).

## Palette de couleurs

Le thème respecte strictement le cahier des charges :

- Rouge principal : `#E24B4A` — Rouge foncé : `#791F1F` / `#501313`
- Fond : `#FFFFFF` / `#FCFCFB` — Cartes : `#F9F8F6`
- Criticité : Critique `#791F1F` · Élevé `#E24B4A` · Moyen `#EF9F27` · Faible `#639922`

Toute visualisation utilisant la palette de criticité est accompagnée d'une
légende visible et explicite (aucune information portée par la seule couleur).

## Dépôt de rapports PDF

La section 5 propose une zone de glisser-déposer qui envoie les fichiers PDF
vers `POST /api/reports`, en `FormData` classique. La route stocke le fichier
via **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** côté
serveur (`put()`), et non sur le disque local (en lecture seule sur les
plateformes serverless comme Vercel). Les fichiers déposés sont immédiatement
consultables/téléchargeables via la liste, alimentée par `GET /api/reports`.
Aucune authentification n'est requise, conformément au cahier des charges
(usage en démonstration de soutenance) ; les fichiers sont stockés avec un
accès public (URL directe de visualisation/téléchargement).

**Limite de taille : 4 Mo par fichier**, appliquée à la fois côté interface
et côté route API. Cette limite est volontairement inférieure à la limite
plateforme des Serverless Functions Vercel sur le corps des requêtes
(~4,5 Mo), puisque le fichier transite entièrement par cette fonction avant
d'être stocké. Pour des rapports plus volumineux, il faudrait soit les
compresser/scinder en amont, soit repasser par un flux d'upload direct
navigateur → Blob Store (écarté ici suite à un dysfonctionnement constaté
côté plateforme sur ce flux).

**Configuration requise — jeton `BLOB_READ_WRITE_TOKEN`** (voir `.env.example`) :

- **Sur Vercel** : dans le dashboard du projet, `Storage` → `Create Database` →
  `Blob`, puis rattacher le store au projet. La variable d'environnement est
  alors injectée automatiquement, aucune action supplémentaire n'est nécessaire.
- **En local** : après avoir créé le Blob Store et lié le projet (`vercel link`),
  récupérer la variable avec `vercel env pull .env.local`, ou la copier
  manuellement depuis le dashboard (`Storage` → le Blob Store → `.env.local`)
  dans un fichier `.env.local` à la racine du projet (non versionné).

## Déploiement Vercel

Le projet est compatible Vercel sans configuration additionnelle
(`vercel deploy`), à condition d'avoir rattaché un Blob Store comme décrit
ci-dessus pour que la zone de dépôt de rapports fonctionne. La section
« Tests automatisés » (voir ci-dessous), elle, ne peut fonctionner que sur
une instance du site tournant en local — c'est un comportement normal et
attendu sur le déploiement Vercel, pas un bug.

## Tests automatisés (régression contre l'agent en local)

La section 6 rejoue en direct 8 scénarios réels de la campagne de Red
Teaming (LLM01-A/B/C, LLM02-A, LLM06-A/B, LLM08-A, LLM10-A) contre l'agent IA
GLPI (FastAPI/LangGraph/Ollama/Qdrant/Redis), qui doit tourner **en local**
sur la même machine/réseau que ce site (`npm run dev`) — l'agent n'est jamais
accessible depuis un déploiement cloud.

**Configuration** (voir `.env.example`) :

- `AGENT_API_URL` — par défaut `http://localhost:8000`.
- `AGENT_API_KEY` — jamais codée en dur ; définie uniquement via variable
  d'environnement côté serveur (le navigateur ne la reçoit jamais, toutes les
  requêtes vers l'agent transitent par `POST /api/agent-tests`).

Avant chaque test, la route effectue un healthcheck (`GET {AGENT_API_URL}/docs`,
timeout 3 s). Si l'agent ne répond pas, un message clair s'affiche
immédiatement (aucun plantage ni spinner infini) : c'est le comportement
attendu sur le site déployé en ligne.

Chaque scénario est rejoué sur ses répétitions prévues, avec un identifiant
de ticket différent à chaque exécution pour éviter les doublons. Le verdict
(vulnérable / protégé / partiel), le taux de contournement (ex. « 0/5 ») et
un extrait de la réponse brute de l'agent sont affichés par scénario, pour
preuve. L'historique des exécutions est conservé dans le `localStorage` du
navigateur (aucun service externe), et alimente en direct le tableau de bord
de la section (tests lancés, taux de protection global, dernière exécution).

## Modélisation STRIDE-AI

Intégrée à la section « Résultats des tests », une matrice croise les
composants de l'agent (Ollama, Qdrant, LangGraph, FastAPI, Redis) avec les
six catégories STRIDE, chaque cellule pertinente étant reliée à un constat
réel de l'audit et colorée selon sa criticité (légende visible en dessous).

## Résumé exécutif PDF

Bouton « Télécharger le résumé exécutif » dans la section « Vue d'ensemble » :
génère un PDF d'une page entièrement côté client (`jsPDF`, aucun stockage ni
service externe) avec les indicateurs clés, la répartition par criticité, les
constats critiques principaux et la valeur ajoutée pour la BICEC.

## Notes techniques

- Illustrations 100% vectorielles (SVG animées via Framer Motion), sans
  dépendance à des banques d'images externes — le site reste utilisable hors
  connexion pendant la démonstration.
- Graphiques réalisés avec Recharts (barres, donut, courbes) ; la jauge de
  risque avant/après est un composant SVG custom.
- Accessibilité : contrastes vérifiés, légendes toujours visibles (jamais
  uniquement au survol), attributs `role="img"` + `aria-label` sur les
  graphiques. Chaque niveau de criticité est également porté par une icône
  distincte (alerte pleine / alerte simple / info / coche), en plus de la
  couleur, partout où il apparaît sur le site.
