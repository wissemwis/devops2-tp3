# TP3 — Tester une application conteneurisée

**Module :** DevOps 2 (ECUE733) · **Durée :** ~4 h · **Travail :** en binôme, à la maison

Vous reprenez la stack du TP2 (Next.js, Strapi, PostgreSQL, pgAdmin). Le site présente
désormais **les cours du module DevOps**, avec la charte graphique du TP1 : une liste de cours
que l'on peut chercher et filtrer, et une fiche par cours.

Cette fois, le projet est **déjà outillé** : des tests unitaires, de composant, d'intégration et
de bout en bout sont fournis, ainsi qu'un serveur **SonarQube**. Vous allez les exécuter, lire
leurs résultats, corriger ce qu'ils révèlent et répondre aux questions du fichier
[`REPONSES.md`](REPONSES.md).

| Service         | Rôle                                         | Profil     | Port hôte |
|-----------------|----------------------------------------------|------------|-----------|
| `frontend`      | Site Next.js des cours                       | —          | 3000      |
| `strapi`        | CMS headless : API REST + admin              | —          | 1337      |
| `postgres`      | Base de données de Strapi                    | —          | *aucun*   |
| `pgadmin`       | Administration de la base                    | —          | 5050      |
| `unit`          | Tests unitaires + de composant (Vitest)      | `test`     | —         |
| `integration`   | Tests d'intégration front ↔ Strapi (Vitest)  | `test`     | —         |
| `e2e`           | Tests de bout en bout (Playwright)           | `e2e`      | —         |
| `sonarqube`     | Serveur d'analyse de la qualité du code      | `quality`  | 9000      |
| `sonar-scanner` | Analyse le code et envoie le rapport         | `quality`  | —         |

> **Les profils Compose.** Un service rangé dans un profil (`profiles: ["test"]`) **ne démarre
> pas** avec un simple `docker compose up`. On ne le lance qu'à la demande : la stack du TP2 reste
> légère, et les outils de test ne tournent que lorsqu'on en a besoin.
>
> | Commande                                  | Ce qui démarre                                        |
> |-------------------------------------------|-------------------------------------------------------|
> | `docker compose up -d`                    | frontend, strapi, postgres, pgadmin (comme au TP2)    |
> | `docker compose --profile quality up -d`  | la même chose + SonarQube                             |
> | `docker compose run --rm unit`            | lance les tests unitaires une fois, puis supprime le conteneur |

## Objectifs

À la fin du TP, vous saurez :

1. situer les quatre niveaux de la **pyramide des tests** et ce que chacun apporte ;
2. lire un **rapport de couverture** et en connaître les limites ;
3. distinguer test **unitaire**, test **de composant** et test **d'intégration** ;
4. analyser l'échec d'un test **Playwright** à l'aide de son rapport et de sa trace ;
5. **brancher SonarQube** sur un projet et définir un **Quality Gate** ;
6. interpréter un rapport SonarQube : bugs, vulnérabilités, code smells, duplication, dette technique.

## Prérequis

- Docker Desktop (ou Docker Engine) avec **Docker Compose v2** : `docker compose version`
- **Environ 4 Go de RAM disponibles pour Docker** (SonarQube en consomme 2 à 3 à lui seul).
  Sous Docker Desktop : *Settings → Resources → Memory*.
- Node.js n'est **pas** nécessaire : tous les outils tournent dans des conteneurs.
- Avoir terminé le TP2.

## Structure du dépôt

```
.
├── docker-compose.yml          # stack + services de test (profils test, e2e, quality)
├── .env.example                # à copier en .env
├── REPONSES.md                 # vos réponses (à compléter)
├── backend/                    # Strapi : type « Cours » + 6 cours créés au démarrage
└── frontend/
    ├── app/                    # pages Next.js (accueil, fiche cours)
    ├── components/             # CoursCard, CoursFilters, CoursList, DevOpsLoop
    ├── lib/
    │   ├── cours.ts            # logique pure : durée, filtre, tri
    │   └── api.ts              # appels à l'API Strapi
    ├── tests/
    │   ├── unit/               # tests unitaires
    │   ├── component/          # tests de composant
    │   ├── integration/        # tests d'intégration
    │   └── e2e/                # tests de bout en bout
    ├── vitest.config.mts       # configuration de Vitest (unitaire, composant, intégration)
    ├── playwright.config.ts    # configuration de Playwright
    └── sonar-project.properties  # configuration de l'analyse SonarQube (à compléter)
```

> **Rendu progressif.** Répondez aux questions dans `REPONSES.md` au fil de l'eau, et faites les
> **commits demandés** au moment indiqué : ils font partie de l'évaluation.

---

## Partie 0 — Mise en route (20 min)

Le membre A du binôme **forke** ce dépôt, A et B clonent le fork.

Si la stack du TP2 tourne encore, arrêtez-la d'abord (elle utilise les mêmes ports) : dans le
dossier du TP2, `docker compose down`.

```bash
git clone <url-du-fork> tp3 && cd tp3
cp .env.example .env
docker compose up -d --build
docker compose ps          # attendre que strapi et frontend soient "healthy"
```

Ouvrez http://localhost:3000 : la page d'accueil affiche **6 cours**. Cliquez sur un cours pour
voir sa fiche. Les cours sont créés automatiquement par Strapi au premier démarrage
(`backend/src/index.js`).

> Si un port est déjà utilisé sur votre machine, changez-le dans `.env`
> (`FRONTEND_PORT`, `STRAPI_PORT`, `PGADMIN_PORT`, `SONAR_PORT`).

## Partie 1 — La pyramide des tests (15 min)

Parcourez le dossier `frontend/tests/` et les fichiers `vitest.config.mts` et
`playwright.config.ts`, ainsi que les services `unit`, `integration` et `e2e` du
`docker-compose.yml`.

➡️ Répondez à **Q1 et Q2**.

## Partie 2 — Tests unitaires (40 min)

Les tests unitaires vérifient les fonctions de `frontend/lib/cours.ts` **isolément**, sans
navigateur, sans réseau et sans Strapi. Le même service lance aussi les tests de composant
(partie 3) et mesure la **couverture de code**.

```bash
docker compose run --rm unit
```

1. Un test échoue. Lisez attentivement le message, retrouvez la fonction en cause dans
   `frontend/lib/cours.ts` et **corrigez-la**. Relancez les tests jusqu'à ce qu'ils passent tous.
   ```bash
   git add frontend/lib/cours.ts
   git commit -m "Corrige formatDuration pour les heures pleines"
   ```
2. Ouvrez le rapport de couverture dans votre navigateur : `frontend/coverage/index.html`.
   Cliquez sur `cours.ts` : les lignes et branches non exécutées sont surlignées.
   Faites une capture du rapport : `captures/couverture.png`.
3. Ajoutez **deux tests** à `filterCours` dans `frontend/tests/unit/cours.test.ts` :
   - une liste de cours **vide** donne une liste vide ;
   - une **recherche texte combinée à un niveau** (par exemple `{ query: "git", level: "debutant" }`).

   Relancez, puis :
   ```bash
   git add frontend/tests/unit/cours.test.ts
   git commit -m "Ajoute des tests sur filterCours pour couvrir la recherche"
   ```

➡️ Répondez à **Q3 à Q7**.

## Partie 3 — Tests de composant (20 min)

Les tests de composant affichent un composant React dans un **navigateur simulé** (jsdom) et
interagissent avec lui comme un utilisateur (Testing Library). Ils ont été lancés en même temps
que les tests unitaires.

Lisez `frontend/tests/component/CoursCard.test.tsx` et `CoursFilters.test.tsx`, ainsi que les
composants testés dans `frontend/components/`.

➡️ Répondez à **Q8 à Q10**.

## Partie 4 — Tests d'intégration (20 min)

Les tests d'intégration appellent les fonctions de `frontend/lib/api.ts` contre le **vrai
Strapi** qui tourne dans Docker (`http://strapi:1337`).

```bash
docker compose run --rm integration
```

Arrêtez maintenant Strapi et relancez les tests d'intégration, puis les tests unitaires :

```bash
docker compose stop strapi
docker compose run --rm --no-deps integration
docker compose run --rm unit
docker compose start strapi
```

> Sans `--no-deps`, `docker compose run` démarre d'abord les services listés dans `depends_on`…
> et Strapi serait relancé avant les tests.

➡️ Répondez à **Q11 à Q13**.

## Partie 5 — Tests de bout en bout avec Playwright (40 min)

Les tests E2E pilotent un **vrai navigateur** (Chromium) sur le site déployé
(`http://frontend:3000`) : ils testent l'application complète, du navigateur jusqu'à la base.

Le conteneur `frontend` a été construit en partie 0, **avant** votre correction : il contient
toujours le bug.

```bash
docker compose run --rm e2e
```

1. Un scénario échoue. Ouvrez le rapport HTML dans votre navigateur :
   `frontend/playwright-report/index.html`. Regardez le message d'erreur et la capture d'écran.
2. Ouvrez la **trace** : allez sur https://trace.playwright.dev et glissez-y le fichier
   `frontend/test-results/<nom-du-test>/trace.zip`. Parcourez les étapes : vous voyez la page
   à chaque action. Faites une capture du rapport en échec : `captures/playwright-echec.png`.
3. Reconstruisez le frontend avec votre correction, puis relancez les tests :
   ```bash
   docker compose up -d --build frontend
   docker compose run --rm e2e
   ```

Pour la question Q16, notez la durée affichée à la fin de chaque suite de tests (unitaire,
intégration, E2E).

➡️ Répondez à **Q14 à Q17**.

## Partie 6 — Analyse de la qualité avec SonarQube (65 min)

SonarQube analyse le code **sans l'exécuter** (analyse statique) et y ajoute la couverture
mesurée par Vitest.

> Pour libérer de la mémoire : `docker compose stop pgadmin`.

### 6.1 Démarrer SonarQube

```bash
docker compose --profile quality up -d sonarqube
docker compose ps sonarqube        # attendre "healthy" (1 à 3 minutes)
```

Ouvrez http://localhost:9000, connectez-vous avec `admin` / `admin` et choisissez un nouveau
mot de passe.

Passez ensuite SonarQube en mode **Standard Experience**, qui utilise le vocabulaire de ce TP
(bugs, vulnérabilités, code smells) : *Administration → Configuration → General Settings →
Mode* → *Standard Experience* → *Save*. Le mode par défaut, *Multi-Quality Rule (MQR)*, classe
les problèmes autrement (Security, Reliability, Maintainability).

### 6.2 Créer un jeton d'analyse

*My Account → Security → Generate Tokens* : nom `tp3`, type **Global Analysis Token**.
Copiez le jeton (il ne sera plus affiché) et collez-le dans `.env` :

```
SONAR_TOKEN=sqa_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6.3 Brancher le projet

Complétez les `___` de `frontend/sonar-project.properties` :

- `sonar.projectKey` : `tp3-cours` ;
- `sonar.sources` : les dossiers du code applicatif ;
- `sonar.tests` : le dossier des tests ;
- `sonar.javascript.lcov.reportPaths` : le fichier `lcov.info` produit par Vitest
  (chemin relatif au dossier `frontend/`).

Lancez les tests (pour produire la couverture), puis l'analyse :

```bash
docker compose run --rm unit
docker compose run --rm sonar-scanner
```

Le projet **TP3 - Cours DevOps** apparaît dans SonarQube.

### 6.4 Créer le Quality Gate

Un *Quality Gate* est l'ensemble des conditions qu'un projet doit remplir pour être déclaré
livrable.

1. *Quality Gates → Create* : nom **TP3**. SonarQube y place d'office des conditions sur le
   *New Code*. Gardez-les.
2. *Add Condition* → **On Overall Code** :
   - *Coverage* — is less than — **90** ;
   - *Vulnerabilities* — is greater than — **0**.
3. Onglet *Projects* du gate (ou *Project Settings → Quality Gate* dans le projet) : associez
   le gate **TP3** au projet `tp3-cours`.

Relancez l'analyse :

```bash
docker compose run --rm unit
docker compose run --rm sonar-scanner
```

Le scanner se termine en erreur avec `QUALITY GATE STATUS: FAILED`. C'est voulu
(`sonar.qualitygate.wait=true`). Faites une capture du tableau de bord (`captures/sonar-rouge.png`),
puis explorez le rapport : onglets *Issues*, *Security Hotspots*, *Measures* (couverture,
duplications, dette), et la vue *Code*.

➡️ Répondez à **Q18 à Q20**.

### 6.5 Corriger et ré-analyser

1. **La vulnérabilité.** Le mot de passe écrit en dur dans `frontend/lib/api.ts` doit venir de
   l'environnement : remplacez la valeur par `process.env.STRAPI_CLIENT_PASSWORD ?? ""`, ajoutez
   `STRAPI_CLIENT_PASSWORD: ${STRAPI_CLIENT_PASSWORD}` dans l'`environment` du service `frontend`,
   et une ligne `STRAPI_CLIENT_PASSWORD=change-moi` dans `.env.example` et `.env`.
2. **Deux code smells** de votre choix dans `frontend/components/CoursList.tsx`.
3. Vérifiez que rien n'est cassé, puis commitez :
   ```bash
   docker compose up -d --build frontend
   docker compose run --rm unit
   docker compose run --rm e2e
   git add -A frontend docker-compose.yml .env.example
   git commit -m "Corrige les problèmes signalés par SonarQube"
   ```
4. Ré-analysez : le Quality Gate passe au **vert** (`captures/sonar-vert.png`).
   ```bash
   docker compose run --rm sonar-scanner
   ```

➡️ Répondez à **Q21 à Q26**.

## Partie 7 — Synthèse (20 min)

➡️ Répondez à **Q27**.

Pour finir, commitez vos réponses et vos captures :

```bash
git add REPONSES.md captures/
git commit -m "Ajoute les réponses et les captures du TP3"
git push
```

---

## Livrables

Sur votre fork, branche `main` :

1. `REPONSES.md` complété ;
2. les **trois commits** demandés (correction du bug, ajout des tests, corrections SonarQube) ;
3. `frontend/sonar-project.properties` complété ;
4. un dossier `captures/` contenant `couverture.png` (rapport de couverture),
   `playwright-echec.png` (rapport Playwright en échec), `sonar-rouge.png` et `sonar-vert.png`.

## Barème indicatif (/20)

| Critère                                                         | Points |
|-----------------------------------------------------------------|:------:|
| Stack et outils de test fonctionnels                            | 2      |
| Partie 2 : bug corrigé, 2 tests ajoutés, couverture ≥ 90 %      | 4      |
| Parties 1, 3, 4 : réponses                                      | 4      |
| Partie 5 : analyse du rapport Playwright                        | 3      |
| Partie 6 : SonarQube branché, Quality Gate vert, réponses       | 5      |
| Partie 7 et qualité du rendu (commits, captures)                | 2      |

## Pièges fréquents

- **`docker compose run` redémarre les dépendances** déclarées dans `depends_on` : utilisez
  `--no-deps` pour l'en empêcher.
- **Le site affiche toujours l'ancien code** : le conteneur `frontend` exécute l'image construite
  au dernier `--build`. Après une modification, `docker compose up -d --build frontend`.
- **Sous Linux, les rapports appartiennent à `root`** (`coverage/`, `playwright-report/`,
  `test-results/`) : pour les supprimer, `sudo rm -rf frontend/coverage frontend/playwright-report frontend/test-results`.
- **SonarQube s'arrête au démarrage sous Linux** : `sudo sysctl -w vm.max_map_count=524288`,
  puis relancez-le.
- **SonarQube est lent au premier démarrage** : attendez l'état `healthy` avant de lancer le scanner.
- **« Not authorized » ou « Project not found » au scan** : `SONAR_TOKEN` est vide dans `.env`,
  ou le jeton est de type *Project* et lié à un autre projet. Créez un *Global Analysis Token*.
- **Le scanner « échoue » alors que l'analyse est faite** : le Quality Gate est rouge et
  `sonar.qualitygate.wait=true` transforme ce verdict en code d'erreur. C'est le comportement
  attendu.
- **La couverture n'apparaît pas dans SonarQube** : relancez `unit` **avant** `sonar-scanner`,
  et vérifiez le chemin `sonar.javascript.lcov.reportPaths`.
- **Après une modification de `package.json`**, reconstruisez les images de test :
  `docker compose run --rm --build unit`.

## Commandes utiles

```bash
docker compose up -d --build                      # construit et démarre la stack
docker compose ps                                 # état et santé des services
docker compose run --rm unit                      # tests unitaires + composant + couverture
docker compose run --rm integration               # tests d'intégration (Strapi requis)
docker compose run --rm --no-deps integration     # idem, sans démarrer les dépendances
docker compose run --rm e2e                       # tests de bout en bout (Playwright)
docker compose up -d --build frontend             # reconstruit le site après une modification
docker compose --profile quality up -d sonarqube  # démarre SonarQube (http://localhost:9000)
docker compose run --rm sonar-scanner             # analyse SonarQube
docker compose logs -f strapi                     # suivre les logs d'un service
docker compose --profile test --profile e2e --profile quality down -v   # tout arrêter et effacer
```
