# Analyse comparative — Deep Research ChatGPT et Gemini

**Projet :** WebMCP Quantum Call Gate (WebMCP-QCG)  
**Date de l'analyse :** 27 août 2026  
**Statut :** synthèse de recherche validée; architecture candidate, MVP non encore verrouillé  
**Mandat canonique :** `DEEP_RESEARCH_PROMPT_9_39_CANONICAL_FR.md`  
**Corpus comparé :** `deep-research-report-chatgpt.md` et `deep-research-report-gemini.md`

## 1. Verdict exécutif

Les deux recherches ne doivent pas être fusionnées à poids égal.

- **Le rapport ChatGPT fournit l'ossature factuelle et architecturale.** Il respecte les neuf axes, couvre P01 à P30, distingue généralement faits, inférences et inconnues, et conserve le MVP ouvert. Il est la meilleure base de rédaction, après remplacement de ses citations internes non portables.
- **Le rapport Gemini fournit surtout un contrechamp créatif et un banc de contradictions.** Il apporte de bonnes images éditoriales, une démonstration centrée sur le refus et quelques idées de tests, mais il contient plusieurs erreurs d'API, généralisations, seuils inventés, sources secondaires faibles et décisions prématurées. Il ne doit pas servir de source d'autorité.
- **Le résultat commun le plus fort n'est pas un orchestrateur quantique universel.** C'est un contrôle pré-exécution qui détermine si une demande mérite de devenir une compilation, une simulation ou une exécution distante.
- **Le nom WebMCP-QCG est donc juste**, à condition de distinguer le produit de ses outils WebMCP. WebMCP-QCG est le système. `preflight_quantum_request` serait son outil décisionnel central; une éventuelle exécution doit rester dans une surface distincte et explicitement autorisée.

La thèse consolidée est la suivante :

> Une surface agentique quantique utile ne commence pas par exécuter un circuit. Elle commence par établir ce qui est demandé, ce qui est compatible, ce qui est déjà prouvé, ce qui manque, ce que la machine peut supporter et ce que l'utilisateur a réellement autorisé.

Sa formule éditoriale la plus compacte est : **une preuve d'accès n'est pas une preuve d'autorité**.

## 2. Intégrité et couverture des deux rapports

| Mesure | Mandat | ChatGPT | Gemini |
|---|---:|---:|---:|
| Taille UTF-8 | 14 129 octets | 87 715 octets | 74 792 octets |
| Mots approximatifs | 1 763 | 10 771 | 9 194 |
| Questions P01–P30 présentes | 30/30 | 30/30 | 30/30 |
| URLs canoniques reprises | 30 | 30 | 30 |
| URLs uniques totales | 30 | 34 | 55 |
| Résumé demandé, 500–800 mots | — | conforme, environ 774 | non conforme, environ 436 |
| Matrice P01–P30 | requise | 30 identifiants uniques | 30 lignes, seulement 22 identifiants uniques |
| Citations publiquement portables | requises | non, 129 marqueurs internes à réparer | non, appels et bibliographie désalignés |
| MVP laissé ouvert | requis | oui | non, sélection prématurée |

**Empreintes des sources analysées :**

- ChatGPT : `BA6F32AEA7AEA3775F1218394E8E5D1E20C64B08520F4C3A07007F09712B8D21`
- Gemini : `5C266DEECB99576C8BD66F33BC53B6FF03767735BB89E1FFBECB06F6F2092823`

L'intersection de 30 URLs entre les rapports montre que Gemini a bien reçu le même mandat. Son union de 59 URLs avec ChatGPT ne signifie toutefois pas une meilleure preuve : plusieurs ajouts sont des billets, Reddit, liens dupliqués, mauvais dépôts ou sources mal attribuées. La divergence est donc utile pour découvrir des pistes, pas pour additionner aveuglément les références.

## 3. Ce que les deux rapports établissent ensemble

### 3.1 Le besoin n'est pas une API quantique universelle

Qiskit, TorchQuantum, TensorFlow Quantum, CUDA-Q et Azure/QDK n'expriment pas les mêmes objets, ne ciblent pas les mêmes usages et n'offrent pas les mêmes garanties. Les convertir vers un format commun sans pertes silencieuses serait une promesse trop forte pour un MVP.

La bonne abstraction commune est une **enveloppe de capacités**, pas une représentation universelle de tous les circuits. L'enveloppe décrit ce que chaque adaptateur sait vérifier ou exécuter. Le workload natif demeure référencé par son format, son hash et son adaptateur.

### 3.2 La cible doit être étudiée avant l'exécution

Une cible possède au moins quatre dimensions séparées :

1. capacité computationnelle;
2. disponibilité opérationnelle au moment de la demande;
3. coût ou plafond budgétaire;
4. autorisation humaine.

Un backend compatible n'est pas nécessairement disponible. Un backend disponible n'est pas nécessairement abordable. Une demande abordable n'est pas nécessairement autorisée.

### 3.3 Le navigateur est une surface d'autorité, pas le moteur quantique complet

WebMCP permet à la page d'exposer des fonctions JavaScript via `document.modelContext`. Le navigateur peut donc recevoir la demande, inspecter des preuves, rendre une décision et demander une escalade. Il ne doit pas prétendre que WebMCP normalise les frameworks quantiques ou fournit lui-même un mécanisme de consentement transactionnel.

Le texte actuel de la spécification est un **Draft Community Group Report**, non une recommandation W3C. L'ancien document de proposition contenait `requestUserInteraction`; cette méthode n'apparaît pas dans la spécification actuelle. Le consentement du QCG doit donc être implémenté dans l'application et testé, non supposé fourni par WebMCP.

### 3.4 Le local-first est un ordre d'escalade

Le chemin robuste est :

1. réutiliser une preuve encore valable;
2. refuser une demande incompatible ou hors limites;
3. analyser, compiler ou simuler localement lorsque possible;
4. demander les informations manquantes;
5. demander un consentement explicite;
6. seulement ensuite envisager une exécution distante ou QPU.

Colab peut être un adaptateur optionnel, mais ne doit pas être le chemin critique. Ses ressources sont variables et le contrôle distant de runtimes gratuits gérés est encadré. Une dépendance structurelle à Colab rendrait la démonstration fragile.

### 3.5 Le refus peut être une réussite produit

Une démonstration utile peut montrer que le QCG empêche une exécution parce que :

- la preuve est encore réutilisable;
- le format ou la cible est incompatible;
- la mémoire estimée dépasse le plafond;
- les données de cible sont périmées;
- le coût est inconnu;
- le consentement est absent.

La preuve négative correspondante est l'absence observable d'invocation de l'adaptateur et, lorsque le cas l'exige, l'absence de trafic réseau.

## 4. Rapport ChatGPT — garder, corriger, ne pas surinterpréter

### À garder comme base canonique

1. Le QCG est un gate pré-exécution, non un compilateur universel.
2. Le Québec est exclu par les règles officielles; une inscription ou un badge ne modifie pas ce contrat.
3. Les idées écartées restent documentées comme décisions, pas ridiculisées comme échecs.
4. Les adaptateurs natifs publient une enveloppe commune de capacités et retournent `unknown` ou `unsupported` plutôt que de convertir silencieusement.
5. `operation_kind` sépare au minimum analyser, compiler, estimer, simuler et exécuter.
6. Le patron Cobweb `registre → exposition WebMCP → approbation → action` constitue un précédent utile.
7. Résultat, provenance, fraîcheur et autorisation sont quatre dimensions distinctes.
8. QDK/npm/WASM montre un seam crédible dans le navigateur; il faut cependant un spike local pour établir exactement la compilation et la simulation disponibles dans le paquet retenu.
9. QIR reste cible-spécifique et ne doit pas devenir l'IR universel du MVP.
10. La machine d'états, les reason codes et les preuves négatives sont directement transformables en tests.

### À corriger

- Remplacer les 129 marqueurs `turn…` et `filecite…` par des liens directs, permaliens, SHA et références numérotées.
- Scinder la catégorie trop large « appel inutile » :
  - `REDUNDANT` : exécution sans nouvelle valeur décisionnelle;
  - `INFEASIBLE` : incompatible ou hors limites;
  - `NEEDS_INFORMATION` : preuve, coût ou cible insuffisamment connus;
  - `NOT_AUTHORIZED` : consentement absent ou expiré.
- Employer « appel distant/QPU évité » lorsqu'une simulation locale est effectivement exécutée.
- Ne pas publier de réduction d'appels avant benchmark.
- Ne pas transformer les règles autorisant une assistance technique en avis juridique général sur toute sortie d'IA.
- Garder qiskit-fermions comme fixture candidate, non comme dépendance MVP. La version 0.1.0 et une wheel Windows existent, mais cela ne prouve pas sa maturité ni sa pertinence pour le gate.
- Adapter les concepts de RFC 9111 à un prédicat de validité scientifique; un simple TTL n'est pas une preuve de fraîcheur suffisante.
- Réutiliser les concepts PROV-O dans un JSON minimal; ne pas introduire une pile RDF complète dans le MVP.
- Ajouter explicitement les exigences de soumission : live URL, fonctionnement cohérent, dépôt public licencié, anglais ou traduction, vidéo publique de moins de trois minutes.

### À laisser comme hypothèse

- le sens du badge Devpost;
- l'état de l'inscription sans capture datée et hashée;
- le meilleur adaptateur final;
- la réduction réelle d'appels et de coût;
- la capacité à calculer automatiquement la valeur scientifique d'une nouvelle exécution.

## 5. Rapport Gemini — ce qu'il apporte et ce qu'il faut rejeter

### Apports réels à conserver comme inspiration

1. **La métaphore du « pare-feu sémantique ».** Elle rend le QCG compréhensible, à condition de la présenter comme métaphore et non comme garantie de sécurité.
2. **Une démo de correction après refus.** L'agent demande une action, reçoit un reason code, ajuste sa requête, puis obtient une simulation locale. C'est une excellente séquence vidéo.
3. **Un mode mock déterministe.** Il est utile pour les tests du routeur et les preuves négatives, à condition d'être explicitement marqué `mock` et de ne jamais servir de preuve QPU.
4. **Une machine d'états visible.** La décision devient inspectable par l'utilisateur plutôt qu'enfouie dans le raisonnement du modèle.
5. **Une section « ce que le produit ne fait pas ».** Elle est précieuse pour l'article, le README et la soumission.
6. **OpenQASM 3, WASI et les pratiques d'artefacts reproductibles** sont des pistes post-MVP à vérifier dans des sources primaires.
7. **La dramaturgie du refus comme fonctionnalité** est plus forte que la prose ChatGPT, mais doit être arrimée aux preuves de ce dernier.

### Corrections obligatoires

| Affirmation Gemini | Verdict consolidé |
|---|---|
| WebMCP est un standard | Faux : c'est actuellement un Draft Community Group Report. |
| `navigator.modelContext` | Faux dans la spécification actuelle : utiliser `document.modelContext`. |
| Le délai est le 27 août 2026 | Faux : le règlement indique le 3 septembre 2026 à 13 h PDT. |
| L'exclusion du Québec concerne seulement les prix | Faux : les règles excluent les résidents du Québec de l'admissibilité au hackathon. |
| Inspector/Evals ne testent que syntaxe et transport | Trop étroit : Inspector inspecte l'exposition et les schémas; Evals mesure aussi si un agent appelle correctement les outils. Lighthouse reste informatif. |
| `requestUserInteraction` est disponible | Présent dans l'ancienne proposition, absent de la spécification actuelle. |
| TorchQuantum signifie toujours GPU et jamais QPU | Faux : le projet documente CPU/GPU et des chemins vers de vrais appareils. |
| QIR est un binaire universel | Faux : QIR prévoit des profils et compilations cibles; il ne définit pas un jeu de gates universel. |
| qiskit-fermions est chroniquement incompatible Windows | Faux : la version 0.1.0 fournit une wheel Windows x86-64; certains extras restent limités. |
| Colab interdit absolument toute automatisation | Trop absolu : les restrictions visent notamment certains usages des runtimes gratuits gérés; plans payants, Enterprise et runtime local diffèrent. |
| 20 qubits est une limite universelle | Faux : la mémoire croît exponentiellement, mais le plafond dépend de la représentation, du simulateur et de la mémoire disponible. |
| Un circuit Clifford est déterministe | Faux : une simulation Clifford peut rester probabiliste, bien qu'elle soit efficacement simulable. |
| Hash + timestamp = preuve infalsifiable | Faux : cela contribue à l'identité et l'intégrité, pas à la vérité, à la fraîcheur ni à l'autorisation. |
| Sumi est un benchmark matériel/énergétique | Faux : le dépôt public décrit une plateforme d'apprentissage quantique assistée par IA avec Qiskit/Cirq et MCP optionnel. |
| Le MVP 2 est définitivement choisi | Non conforme au mandat : le choix demeure ouvert jusqu'aux spikes et aux critères de preuve. |

### À rejeter sans récupération

- les seuils arbitraires de 10 ou 20 qubits et les délais fixes de deux secondes;
- le TTL universel de 24 heures pour les données de cible;
- l'interdiction de cache par simple type de backend;
- la prétention de « validité mathématique et financière » générale;
- l'idée qu'un UUID devient une preuve cryptographique;
- la suppression de prototypes ou décisions historiques;
- les attaques rhétoriques contre les idées abandonnées;
- les formules base64 cassées et les images mathématiques non accessibles;
- la bibliographie composite comme couche de preuve publique.

## 6. Architecture candidate de WebMCP-QCG

### 6.1 Le produit et ses surfaces

**WebMCP-QCG** est le produit : une page WebMCP et un moteur de décision pré-exécution. Il ne faut pas dire que « WebMCP-QCG est un seul outil » au sens technique.

Contrat candidat, non encore gelé :

1. `inspect_quantum_capabilities`
   - lecture seule;
   - décrit les adaptateurs disponibles, leurs opérations, limites et fraîcheur;
   - ne choisit aucune cible et n'exécute rien.

2. `preflight_quantum_request`
   - pur et déterministe pour un snapshot donné;
   - valide la demande, inspecte les preuves, estime les limites et rend une décision;
   - ne déclenche jamais une exécution distante.

3. `execute_approved_quantum_plan`
   - surface à effets séparée;
   - accepte seulement un `decision_id` encore valide et lié au contenu exact de la demande;
   - vérifie à nouveau le consentement, le snapshot cible et le plafond de coût;
   - peut rester hors du MVP si la démonstration locale suffit.

Cette séparation respecte le principe WebMCP d'outils non chevauchants et empêche l'agent de confondre « analyser » avec « dépenser ».

### 6.2 Entrée minimale du préflight

```json
{
  "schema_version": "webmcp.qcg.request.v1",
  "request_id": "uuid",
  "intent": "human-readable scientific intent",
  "operation_kind": "VALIDATE|COMPILE|ESTIMATE|LOCAL_SIMULATE|REMOTE_SAMPLE|REMOTE_ESTIMATE",
  "framework": "qiskit|torchquantum|tensorflow_quantum|cuda_q|qdk",
  "framework_version": "semver-or-commit",
  "adapter_version": "semver-or-commit",
  "workload": {
    "native_format": "qpy|openqasm3|qsharp|python_ref|other",
    "content_ref": "opaque-reference",
    "expected_sha256": "optional-hex"
  },
  "requested_target_class": "local_cpu|local_gpu|remote_simulator|qpu|auto",
  "constraints": {
    "max_memory_mb": 0,
    "max_runtime_ms": 0,
    "max_shots": 0,
    "max_cost": 0,
    "currency": "USD"
  },
  "evidence_refs": [],
  "authorization_ref": null
}
```

Le QCG calcule lui-même le digest observé; il ne fait pas confiance à un hash fourni par l'agent. Le schéma WebMCP doit rester permissif sur les champs scientifiques difficiles à calculer par un modèle. Les validations déterministes appartiennent au code et aux adaptateurs.

### 6.3 Sortie minimale

```json
{
  "decision_id": "uuid",
  "request_sha256": "hex",
  "decision": "REUSE_EVIDENCE|REJECT_INCOMPATIBLE|REJECT_RESOURCE|DEFER_UNKNOWN|REQUIRE_CONSENT|READY_LOCAL|READY_REMOTE",
  "reason_codes": [],
  "selected_adapter": null,
  "target_snapshot_ref": null,
  "evidence_packet_ref": "opaque-reference",
  "policy_sha256": "hex",
  "consent_receipt_ref": null,
  "expires_at": null,
  "execution_authorized": false
}
```

`DEFER_UNKNOWN` est essentiel : une API injoignable, un coût absent ou une calibration périmée ne prouvent pas une incompatibilité. Les détails `NEEDS_INFORMATION`, `NEEDS_TARGET_REFRESH` et `NEEDS_COST` deviennent des `reason_codes` plutôt que trois verdicts concurrents.

### 6.4 Invariants

- Un hash identifie le contenu; il ne prouve ni sa vérité ni son autorisation.
- Une preuve peut être authentique mais périmée.
- Une cible peut être compatible mais indisponible.
- Une décision n'est exécutable que si elle est liée au hash exact, au snapshot, à l'adaptateur, au plafond et au consentement.
- Un `decision_id` exécutable doit être à usage unique et expirable.
- Une modification de la demande invalide la décision précédente.
- Aucun adaptateur ne doit être invoqué lors d'un refus déterministe.
- Une sortie `mock` ne peut jamais être confondue avec une preuve de simulation distante ou QPU.

### 6.5 Machine d'états candidate

```text
RECEIVED
  -> VALIDATED
  -> EVIDENCE_CHECKED
  -> PREFLIGHTED
      -> REUSE_EVIDENCE
      -> REFUSED
      -> DEFER_UNKNOWN
      -> REQUIRE_CONSENT
      -> READY_LOCAL
      -> READY_REMOTE
  -> EXECUTED          seulement par une surface séparée
  -> EVIDENCE_RECORDED
```

## 7. Ce que les recherches changent pour le MVP

Avant ces recherches, l'idée risquait de devenir un orchestrateur reliant quatre ou cinq frameworks, Colab, des simulateurs, des QPU et plusieurs agents. Après comparaison, la première preuve peut être beaucoup plus étroite et plus forte.

### Chaîne verticale candidate

1. Une page expose le QCG par WebMCP.
2. L'agent soumet une demande quantique native et bornée.
3. Le gate vérifie le manifeste, la preuve et les limites.
4. Un adaptateur local Qiskit/Aer sert de chemin d'exécution de référence.
5. Le gate rend un reason code lisible.
6. Une requête acceptable peut produire une simulation locale bornée.
7. Une requête refusée prouve qu'aucun exécuteur et aucun réseau n'ont été appelés.
8. Un paquet de preuve JSON consigne les entrées, la décision, les versions, les hashes et les sorties.

### Fixtures minimales à conserver

- preuve encore réutilisable;
- format ou cible incompatible;
- estimation mémoire hors plafond;
- snapshot de cible périmé;
- coût inconnu;
- consentement absent;
- simulation locale autorisée.

### Spikes nécessaires avant de choisir le MVP final

1. **WebMCP :** confirmer l'invocation native dans ChatGPT et Chrome avec journal serveur ou trace d'application.
2. **QDK navigateur :** confirmer séparément chargement npm/WASM, compilation et simulation dans un Worker; ne pas extrapoler du webinaire.
3. **Qiskit/Aer local :** mesurer une chaîne simple sur la machine ordinaire et définir des plafonds dynamiques.
4. **Preuve négative :** instrumenter l'adaptateur et le réseau pour montrer zéro appel sur refus.
5. **Portabilité :** tester au moins deux manifestes d'adaptateurs sans prétendre exécuter toutes les familles.

Qiskit/Aer demeure le meilleur chemin doré candidat parce qu'il permet une preuve locale claire. QDK/WASM est un spike très prometteur. TorchQuantum, TFQ, CUDA-Q, qiskit-fermions et QPU distants peuvent d'abord apparaître comme profils de capacités honnêtes plutôt que comme intégrations prétendument complètes.

## 8. Ce que les recherches apportent à l'article d'ouverture

### 8.1 L'ossature vient de ChatGPT

Le rapport ChatGPT fournit la discipline de l'article : statut précis des règles, distinction entre standard et incubation, pluralité irréductible des frameworks, progression local-first, limites de la preuve et verdicts conditionnels.

### 8.2 L'énergie narrative vient partiellement de Gemini

Gemini fournit trois images éditoriales réutilisables après correction :

- le gate comme pare-feu sémantique;
- le refus comme fonctionnalité visible;
- l'agent qui corrige sa demande après un reason code plutôt que d'improviser une exécution.

Ces images donnent du mouvement au texte, mais aucun de leurs chiffres ou verdicts ne doit être repris sans source primaire.

### 8.3 Ouverture recommandée

L'article peut s'ouvrir sur une demande très simple : « exécute cette expérience quantique ». Le réflexe habituel est de chercher un backend. Le travail de la journée a renversé la question : avant de chercher où l'exécuter, il faut établir si elle doit être exécutée.

La situation du Québec devient ensuite un miroir, sans devenir le sujet juridique principal : avoir accès à la page d'inscription n'est pas la même chose qu'être autorisé par les règles; de même, avoir accès à un backend n'est pas la même chose qu'avoir une demande compatible, utile, fraîche et autorisée.

Le récit doit employer **« je »** : c'est le parcours d'un développeur solo. Codex est attribué comme collaborateur de recherche, d'audit et d'implémentation, mais ne transforme pas la voix en « nous » collectif.

### 8.4 Répartition consolidée sur neuf chapitres

1. **Participer à découvert.** Exclusion québécoise, décision de construire publiquement et différence entre accès à une interface et autorisation contractuelle.
2. **Ce que WebMCP expose réellement.** `document.modelContext`, outils impératifs/déclaratifs, état d'incubation, limites d'autorité et sécurité.
3. **Les idées laissées sur le banc.** Quantech Vid, WebCCP et web-designer deviennent des décisions documentées qui ont permis de gagner le bon périmètre.
4. **Cinq écosystèmes, aucune langue universelle.** Comparaison factuelle et refus des conversions silencieuses.
5. **Choisir la cible avant le circuit.** Capacité, disponibilité, coût, but scientifique et autorisation.
6. **Le navigateur peut compiler, mais ne doit pas tout promettre.** QDK/WASM, Worker, Cobweb, QIR cible-spécifique et frontières du navigateur.
7. **Construire pour une machine ordinaire.** Croissance mémoire, local-first, accessibilité et Colab seulement comme extension.
8. **WebMCP-QCG : refuser avant de dépenser.** Taxonomie de décisions, preuves, fraîcheur, consentement et différenciation avec Sumi/FNP-QNN.
9. **Une preuve publique vaut plus qu'une promesse.** Dépôt ouvert, ADR, fixtures, traces, vidéo, limites et réussite mesurable même sans prix.

## 9. Politique de preuve pour la rédaction

1. Les rapports Deep Research sont des **cartes de pistes**, pas des sources publiables.
2. Toute affirmation factuelle doit remonter à une source primaire.
3. Une source ne doit servir qu'au chapitre auquel elle a été attribuée dans le protocole 9/39.
4. Les webinaires peuvent orienter le lecteur ou raconter l'apprentissage, mais ne doivent pas porter les affirmations techniques principales.
5. Les observations authentifiées non exportées sont marquées `observed_not_publicly_reproducible`.
6. Une absence dans un README ne prouve pas l'absence dans tout un projet.
7. Une intégration déclarée n'est pas une intégration testée.
8. Une simulation locale ne prouve pas un chemin QPU.
9. Une réduction d'appels n'est publiable qu'après un benchmark reproductible.

## 10. Sources primaires utilisées pour arbitrer les divergences

- [WebMCP — spécification actuelle](https://webmachinelearning.github.io/webmcp/)
- [Règles officielles du WebMCP Challenge](https://webmcp.devpost.com/rules)
- [WebMCP Inspector et Evals](https://github.com/GoogleChromeLabs/webmcp-tools)
- [Lighthouse — audit WebMCP informatif](https://developer.chrome.com/docs/lighthouse/agentic-browsing/registered-webmcp-tools)
- [Bonnes pratiques WebMCP](https://developer.chrome.com/docs/ai/webmcp/best-practices)
- [Microsoft QDK](https://github.com/microsoft/qdk)
- [QDK npm/Q#](https://github.com/microsoft/qdk/tree/main/source/npm/qsharp)
- [QIR specification](https://github.com/qir-alliance/qir-spec/blob/main/specification/README.md)
- [TorchQuantum](https://github.com/mit-han-lab/torchquantum)
- [Qiskit Aer StatevectorSimulator](https://qiskit.github.io/qiskit-aer/stubs/qiskit_aer.StatevectorSimulator.html)
- [qiskit-fermions 0.1.0](https://pypi.org/project/qiskit-fermions/)
- [Google Colab FAQ](https://research.google.com/colaboratory/intl/en-GB/faq.html)
- [Sumi / 1StopQuantum](https://github.com/dlyog/sumi)
- [Cobweb — commit WebMCP](https://github.com/andreban/cobweb/commit/837329616972ec2d5f1df69aa4eed70adb13d5c7)
- [PROV-O](https://www.w3.org/TR/prov-o/)
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)

## 11. Décision de synthèse

Le concept est suffisamment clair pour porter un nom et un contrat candidat : **WebMCP Quantum Call Gate**.

Il n'est pas encore assez vérifié pour figer l'ensemble du MVP. Le prochain verrou n'est plus une nouvelle séance d'idéation générale. Ce sont cinq spikes courts qui doivent décider : exposition native WebMCP, QDK/WASM réel, exécution locale bornée, preuve d'absence d'appel et portabilité d'un second manifeste.

Jusqu'à ces résultats :

- ChatGPT est la base factuelle à nettoyer;
- Gemini est une source d'angles et un red team, pas une autorité;
- WebMCP-QCG est le système;
- le préflight est sa fonction centrale;
- l'exécution reste séparée;
- le refus documenté est un résultat valide;
- aucune économie, universalité, conformité QPU ou valeur scientifique générale n'est encore revendiquée.
