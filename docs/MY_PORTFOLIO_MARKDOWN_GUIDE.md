# Guide de Rédaction d'Articles en Markdown

Ce guide vous aide à tirer parti de toutes les fonctionnalités du rendu Markdown.

## 📝 Syntaxe de Base

### Titres et Navigation

Les titres de niveau 2 et 3 génèrent automatiquement des ancres cliquables :

```markdown
## Introduction à React
### Les Hooks
```

Résultat : Un symbole `#` apparaît au survol, permettant de créer des liens directs vers ces sections.

**⚠️ Important** : Évitez d'utiliser les titres H1 (`#`) dans vos articles. Le titre principal (H1) est déjà affiché automatiquement par le layout. Commencez directement avec les H2 (`##`) pour respecter la hiérarchie sémantique et le SEO.

**💡 Conseil** : Utilisez des titres descriptifs pour faciliter la navigation dans les longs articles.

---

## 💻 Blocs de Code

### Code Inline

Pour du code dans une phrase, utilisez les backticks :

La fonction `useState()` permet de gérer l'état local.

### Blocs de Code avec Coloration Syntaxique

Spécifiez le langage pour activer la coloration syntaxique :

```javascript
const greeting = (name) => {
  return `Hello, ${name}!`;
};
```

**Langages supportés** : `javascript`, `typescript`, `python`, `java`, `bash`, `css`, `html`, `json`, `yaml`, et bien d'autres.

**Fonctionnalités** :
- ✨ Coloration syntaxique automatique (thème clair/sombre)
- 📋 Bouton "Copier" intégré
- 🎨 Style adaptatif selon votre thème

---

## 🖼️ Médias

### Images Classiques

```markdown
![Description de l'image](https://example.com/image.jpg)
![Image locale](/images/photo.jpg)
```

**Chemins supportés** :
- ✅ URL complète : `https://example.com/image.jpg`
- ✅ Chemin absolu : `/images/photo.jpg` (depuis le dossier `public/`)
- ⚠️ Chemin relatif : `./image.jpg` (fonctionne mais sans optimisation Next.js)

Les images sont automatiquement :
- Optimisées avec Next.js Image (pour URLs complètes et chemins absolus)
- Arrondies et stylisées
- Responsive (s'adaptent à l'écran)
- Lazy-loaded pour de meilleures performances

### Vidéos YouTube

**⚠️ Important** : Pour intégrer une vidéo YouTube directement sur votre page, vous devez utiliser le préfixe `embed:youtube` ou `embed:yt` dans le texte alternatif :

```markdown
# Pour INTÉGRER la vidéo sur la page (lecteur vidéo affiché) :
![embed:youtube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
![embed:yt](https://youtu.be/dQw4w9WgXcQ)

# Pour un simple LIEN vers YouTube (sans lecteur intégré) :
[Voir ma vidéo sur YouTube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

**Différence** :
- ✅ `![embed:youtube](url)` → Lecteur vidéo intégré (iframe) directement dans l'article
- 🔗 `[texte](url)` → Simple lien cliquable vers YouTube (pas d'intégration)

Les deux formats d'URL YouTube sont supportés :
- `youtube.com/watch?v=...`
- `youtu.be/...`

### Vidéos Locales

Pour intégrer des vidéos hébergées directement sur votre serveur, utilisez le préfixe `embed:video` :

```markdown
# Pour INTÉGRER le lecteur vidéo :
![embed:video](https://example.com/ma-video.mp4)

# Pour un simple LIEN de téléchargement :
[Télécharger la vidéo](https://example.com/ma-video.mp4)
```

**Formats supportés** : `.mp4`, `.webm`, `.ogg`

---

## 🔗 Liens

### Liens Externes

Les liens externes affichent automatiquement une icône :

```markdown
[Visitez GitHub](https://github.com)
```

Ils s'ouvrent dans un nouvel onglet avec `target="_blank"` et `rel="noopener noreferrer"` pour la sécurité.

### Liens Internes

Pour des liens vers d'autres pages de votre site :

```markdown
[Voir mes projets](/projects)
```

---

## 📐 Formules Mathématiques

Grâce à MathJax, vous pouvez écrire des formules mathématiques :

### Formules Inline

```markdown
L'équation $E = mc^2$ est célèbre.
```

### Blocs de Formules

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**Syntaxe** : Utilisez LaTeX entre `$...$` (inline) ou `$$...$$` (bloc).

---

## 📊 Tableaux

Créez des tableaux structurés :

```markdown
| Fonctionnalité | Support | Notes |
|---------------|---------|-------|
| Coloration syntaxique | ✅ | Automatique |
| Vidéos YouTube | ✅ | Avec `![embed:youtube]` |
| Formules mathématiques | ✅ | LaTeX/MathJax |
```

**Style** : Bordures arrondies et responsive automatique.

---

## 💬 Citations

Pour mettre en évidence des citations :

```markdown
> "La simplicité est la sophistication suprême."
> — Leonardo da Vinci
```

**Style** : Bordure de couleur primaire à gauche, texte en italique.

---

## 📋 Listes

### Liste à Puces

```markdown
- Premier élément
- Deuxième élément
  - Sous-élément
  - Autre sous-élément
```

### Liste Numérotée

```markdown
1. Première étape
2. Deuxième étape
3. Troisième étape
```

---

## ✨ Bonnes Pratiques

### 1. Structure Claire

- **Commencez par H2** : Évitez les H1, le titre principal est déjà géré par le layout
- Utilisez des titres hiérarchiques (H2 → H3 → H4)
- Évitez de sauter des niveaux (ne passez pas de H2 à H4 directement)

### 2. Code Lisible

- Toujours spécifier le langage pour les blocs de code
- Gardez les exemples courts et pertinents
- Ajoutez des commentaires dans le code si nécessaire

### 3. Images Optimisées

- Utilisez des images de qualité raisonnable (pas trop lourdes)
- Ajoutez toujours une description `alt` pertinente
- Privilégiez les formats modernes (WebP, AVIF)

### 4. Accessibilité

- Écrivez des textes alternatifs descriptifs pour les images
- Utilisez des titres clairs et descriptifs
- Évitez les liens du type "cliquez ici" (préférez des textes explicites)

### 5. Performance

- Ne surchargez pas l'article avec trop de médias lourds
- Les vidéos YouTube sont chargées de manière optimisée
- Les images sont automatiquement lazy-loaded