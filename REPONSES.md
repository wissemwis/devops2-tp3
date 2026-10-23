# TP3 — Réponses

**Binôme :** NOM Prénom — NOM Prénom

> Répondez sous chaque question. Les mesures (durées, pourcentages) sont celles de **votre** machine.

## Partie 1 — Pyramide des tests

**Q1.** Pour chacun des dossiers `tests/unit`, `tests/component`, `tests/integration` et `tests/e2e`, indiquez : le niveau de la pyramide, l'outil utilisé, et si la stack Docker doit tourner pour l'exécuter.

**Q2.** Pourquoi la pyramide des tests est-elle large à la base et étroite au sommet ? Donnez au moins deux critères.

## Partie 2 — Tests unitaires

**Q3.** Combien de tests sont exécutés et combien échouent ? Recopiez le message d'échec et expliquez ce que signifient `Expected` et `Received`.

**Q4.** Quelle était la cause du bug dans `formatDuration` ? Expliquez pourquoi la correction fournie le résout.

**Q5.** Avant d'ajouter des tests : relevez la couverture (lignes, branches, fonctions) de `lib/cours.ts`. D'après le rapport HTML, quelles lignes ou branches ne sont pas couvertes ?

**Q6.** Après l'ajout des deux tests fournis : quelle est la nouvelle couverture de `lib/cours.ts` ? Quelles lignes ou branches ces tests exécutent-ils qui ne l'étaient pas ? Reste-t-il quelque chose de non couvert, et pourquoi ?

**Q7.** Quelle différence entre couverture de lignes et couverture de branches ? Un code couvert à 100 % est-il forcément sans bug ? Justifiez avec un exemple tiré de ce TP.

## Partie 3 — Tests de composant

**Q8.** Que vérifie `CoursCard.test.tsx` qu'un test unitaire de `formatDuration` ne vérifie pas ? Quel outil simule le navigateur, et dans quel fichier est-il configuré ?

**Q9.** Pourquoi les tests recherchent-ils les éléments par rôle ou par texte (`getByRole`, `getByText`) plutôt que par classe CSS ?

**Q10.** Pourquoi n'y a-t-il pas de test de composant pour `app/page.tsx` ? Quel niveau de test le couvre ?

## Partie 4 — Tests d'intégration

**Q11.** Que vérifient les tests d'intégration qui n'est vérifié par aucun test unitaire ou de composant ?

**Q12.** Strapi arrêté : quel résultat et quel message obtenez-vous ? Pourquoi les tests unitaires passent-ils toujours ? À quoi sert `--no-deps` ?

**Q13.** Un test d'intégration en échec signale-t-il forcément un bug dans le code ? Citez deux autres causes possibles.

## Partie 5 — Tests de bout en bout

**Q14.** Quel scénario échoue ? Que montrent la capture d'écran et la trace ? Quel lien avec la question Q3 ? Pourquoi échoue-t-il alors que vous avez déjà corrigé le bug en partie 2 ?

**Q15.** Le même bug est détecté par un test unitaire et par un test E2E. Lequel permet de trouver la cause le plus vite ? Lequel prouve que l'utilisateur est touché ?

**Q16.** Complétez le tableau avec vos mesures :

| Niveau | Nombre de tests | Durée d'exécution | Besoin de la stack ? |
|---|---|---|---|
| Unitaire + composant | | | |
| Intégration | | | |
| E2E | | | |

**Q17.** Qu'est-ce qu'un test « flaky » (instable) ? Quels mécanismes de Playwright utilisés ici (attente automatique, assertions `expect(...).toHaveCount`, etc.) réduisent ce risque ?

## Partie 6 — SonarQube

**Q18.** Collez votre `sonar-project.properties` complété et expliquez chaque valeur ajoutée. Pourquoi exclut-on `app/**` et `lib/api.ts` du calcul de couverture ?

**Q19.** Analyse avec le Quality Gate TP3 : statut du gate et conditions en échec ; nombre de bugs, vulnérabilités, security hotspots et code smells ; couverture ; taux de duplication.

**Q20.** Expliquez la différence entre bug, vulnérabilité, security hotspot et code smell, avec un exemple tiré de votre rapport quand il en existe.

**Q21.** Ouvrez la vulnérabilité : quelle règle est en cause et quel est le risque ? Expliquez la correction fournie : d'où vient maintenant le mot de passe, et par quel chemin arrive-t-il jusqu'au code ? Pourquoi un secret dans le code est-il dangereux, même dans un dépôt privé ?

**Q22.** Quels code smells la correction fournie de `CoursList.tsx` fait-elle disparaître ? Pour chacun : règle, sévérité, explication, et ce qui, dans le nouveau code, règle le problème.

**Q23.** Où se trouve le code dupliqué ? Comment le supprimer ? (Ne le faites pas, décrivez seulement.)

**Q24.** Qu'est-ce que la dette technique dans SonarQube et comment est-elle exprimée ? Valeur avant et après vos corrections.

**Q25.** Que signifie « New Code » dans SonarQube ? Quelles conditions du gate TP3 portent sur le nouveau code ? Pourquoi SonarQube recommande-t-il de juger le nouveau code plutôt que le code global ?

**Q26.** Avec `sonar.qualitygate.wait=true`, que fait le scanner quand le Quality Gate est rouge ? Pourquoi est-ce utile dans un pipeline CI ?

## Partie 7 — Synthèse

**Q27.** Proposez l'ordre des étapes d'un pipeline CI pour ce projet (build, tests unitaires, intégration, E2E, analyse Sonar…) et justifiez-le. Quelles étapes doivent bloquer le merge d'une pull request ?
