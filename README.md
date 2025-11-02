# 🌿 Fermentierra Prospection

Site vitrine modernisé pour présenter l'offre Fermentierra aux professionnels de la restauration suisse. Le projet repose sur des pages HTML statiques, stylées avec Bootstrap 5 et une feuille de style personnalisée respectant la palette beige/vert de la marque.

## ✨ Fonctionnalités principales
- Navigation partagée via composants `header` et `footer` chargés dynamiquement.
- Pages dédiées : accueil, catalogue produits, fiches produits, études de cas, blog/guides, formations.
- Données structurées en JSON pour les produits, études de cas, articles et formations.
- Formulaire de contact réutilisable avec validation HTML5, routage par type de demande et lien Calendly.
- Widget flottant pour demande de rappel + intégration Crisp (remplacer l'identifiant).
- Sélecteur multilingue (fr, de, it, en) avec dictionnaires JSON.
- Balises SEO/Open Graph, flux RSS, sitemap et robots.txt prêts pour un hébergement statique.
- Intégration Google Analytics (remplacer l'ID `G-XXXXXXXX`).

## 🗂️ Structure
```
fermentierra-prospection/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   ├── data/        # Contenus JSON (produits, études de cas, blog, formations)
│   │   └── lang/        # Dictionnaires de traduction (fr, de, it, en)
│   ├── components/      # Fragments HTML réutilisables (header, footer, formulaire contact)
│   ├── css/
│   │   └── main.css     # Styles personnalisés (palette beige/vert)
│   ├── js/
│   │   └── main.js      # Chargement des composants, i18n, formulaires, widgets
│   ├── blog.html
│   ├── casestudies.html
│   ├── index.html
│   ├── product.html
│   ├── products.html
│   ├── training.html
│   └── rss.xml
└── README.md
```

## 🚀 Lancer le site en local
1. Ouvrir un terminal à la racine du projet.
2. Servir le dossier `src` avec l'outil de votre choix (exemples) :
   ```bash
   npx serve src
   # ou
   python3 -m http.server --directory src
   ```
3. Visiter `http://localhost:3000` (ou l'URL indiquée) pour visualiser le site.

> ℹ️ Les composants sont chargés via `fetch`. Il est donc nécessaire d'utiliser un serveur HTTP local et non d'ouvrir directement les fichiers dans le navigateur.

## 🔧 Personnalisation
- **Crisp / Analytics** : remplacer `YOUR_CRISP_WEBSITE_ID` et `G-XXXXXXXX` dans le code.
- **Contenus** : modifier les fichiers JSON dans `src/assets/data` ou les textes directement dans les pages.
- **Traductions** : compléter les dictionnaires dans `src/assets/lang`.
- **Images** : les fichiers utilisent des liens `https://via.placeholder.com/`. Remplacez-les par vos propres URL optimisées (WebP recommandées).

## 📦 Déploiement
Le site est prêt pour un hébergement statique (GitHub Pages, Netlify, Vercel…). Déployer le contenu du dossier `src/` (ainsi que `public/` si votre plateforme gère un dossier public) en veillant à conserver l'arborescence.

## 🛡️ Accessibilité & conformité
- Structure sémantique (sections, nav, aria-labels).
- Couleurs contrastées respectant le niveau AA.
- Formulaire compatible clavier + messages d'erreur accessibles.

## 📝 Licence
Projet interne Fermentierra — usage professionnel réservé.
