# My Portfolio

Portfolio personnel professionnel développé avec **Next.js 15** et **Strapi**, déployé sur **Vercel**.

## 🚀 Fonctionnalités

- **Interface moderne** avec support du thème clair/sombre
- **Blog d'articles** avec rendu Markdown avancé
- **Portfolio de projets** avec galeries d'images
- **Recherche en temps réel** d'articles et de projets
- **Design responsive** avec navigation mobile optimisée
- **Performance optimisée** avec ISR (Incremental Static Regeneration)
- **CV intégré** avec expériences, formations et compétences
- **Flux RSS** pour les articles et projets
- **SEO optimisé** avec métadonnées dynamiques

## 🛠️ Technologies

### Frontend
- **Next.js 15** avec App Router
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **Lucide React**
- **MathJax**
- **React Markdown**

### Backend (Headless CMS)
- **Strapi** - CMS headless pour la gestion du contenu
- **Strapi SDK** - Client API avec retry et cache

### Infrastructure
- **Vercel** - Hébergement et déploiement
- **ISR** - Régénération statique incrémentale (1h)
- **Edge Functions** - Pour les routes API optimisées

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Un serveur Strapi configuré (ou utilisez Strapi Cloud)

### Configuration

1. **Cloner le repository**
```bash
git clone https://github.com/daniozo/my-portfolio.git
cd my-portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :

```env
# API Strapi
NEXT_PUBLIC_STRAPI_URL=https://votre-instance.strapiapp.com
STRAPI_API_TOKEN=votre_token_api

# Configuration optionnelle
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEFAULT_LANG=fr
NEXT_PUBLIC_SITE_URL=https://le-domaine-du-portfolio.com

# Rate limiting (API de recherche)
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

Voir [`.env.example`](.env.example) pour plus de détails.

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🏗️ Scripts

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production
- `npm start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## 📚 Documentation

### Architecture

Le projet utilise l'architecture Next.js 15 App Router :

```
src/
├── app/                    # Pages et routes
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil (articles)
│   ├── articles/          # Pages articles
│   ├── projects/          # Pages projets
│   ├── me/               # Page À propos
│   ├── legal/            # Mentions légales
│   └── api/              # Routes API
├── components/            # Composants React
│   ├── layout/           # Composants de layout
│   ├── markdown/         # Rendu Markdown
│   ├── ui/              # Composants UI réutilisables
│   └── cv/              # Composants CV
├── lib/                  # Utilitaires et services
│   ├── strapi-client.ts # Client API Strapi
│   ├── data.ts          # Service de données
│   ├── cache.ts         # Système de cache
│   └── transformers.ts  # Transformateurs de données
├── types/               # Types TypeScript
└── contexts/           # Contextes React
```

### Guide de Rédaction

Pour apprendre à rédiger des articles en Markdown avec toutes les fonctionnalités supportées (code, vidéos, formules mathématiques, etc.), consultez le **[Guide de Rédaction Markdown](docs/MY_PORTFOLIO_MARKDOWN_GUIDE.md)**.

### ISR (Incremental Static Regeneration)

Le site utilise ISR avec une période de revalidation de **1 heure** :
- Les pages sont pré-générées au build quand Strapi est disponible
- Les pages sont servies depuis le cache (rapide ⚡)
- Le cache est régénéré toutes les heures en arrière-plan
- Si Strapi est indisponible, le cache existant est servi

### Gestion des Erreurs

Le site gère gracieusement les erreurs Strapi :
- Retry automatique (3 tentatives)
- Messages d'erreur clairs pour l'utilisateur
- Fallback sur le cache si disponible
- Logging détaillé pour le débogage

## 🎨 Personnalisation

### Thème et Couleurs

Les couleurs sont configurées dans [`tailwind.config.ts`](tailwind.config.ts) et [`src/app/globals.css`](src/app/globals.css).

## 🚀 Déploiement

### Vercel (Recommandé)

1. Pushez votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Configurez les variables d'environnement
4. Déployez !

Les variables d'environnement nécessaires :
- `NEXT_PUBLIC_STRAPI_URL`
- `NEXT_PUBLIC_STRAPI_API_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted avec Docker

## 🔧 Configuration Avancée

### Next.js

La configuration Next.js se trouve dans [`next.config.ts`](next.config.ts) :
- Domaines d'images autorisés
- Optimisations de bundle
- Headers de sécurité (CSP)

### Cache et Performance

- **Cache mémoire** pour les requêtes Strapi (TTL: 5 minutes)
- **ISR** pour les pages statiques (revalidation: 1 heure)
- **Rate limiting** sur l'API de recherche (10 req/min)

## 🤝 Contributing

Les contributions externes (pull requests) ne sont pas acceptées.
Toute amélioration ou modification du code doit se faire par duplication du dépôt (fork) sur un compte personnel, puis adaptation du projet au besoin.

## 📝 License

Ce projet est sous licence MIT.

## 👤 Auteur

[@daniozo](https://github.com/daniozo)