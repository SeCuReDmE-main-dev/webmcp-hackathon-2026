# WebMCP Quantum — quatre surfaces, dix MVP et un préflight anti-appel inutile

Date de recherche : 2026-08-27  
Statut : brief de décision, avant implémentation

## Objective

Transformer plusieurs intuitions complémentaires en dix MVP réellement distincts pour un hackathon WebMCP : construction de circuits, compilation, exécution par primitives, visualisation, `qiskit-fermions`, TorchQuantum, TensorFlow Quantum et Azure Quantum. Le fil directeur retenu est d'éviter les appels inutiles à un simulateur, à un QPU ou à un service payant en produisant d'abord un préflight explicable.

## Environment / Stack Context

- WebMCP expose des outils structurés depuis la page au moyen de `document.modelContext.registerTool()`; il n'exécute pas lui-même les calculs quantiques.
- Qiskit fournit circuits, transpilation, primitives et visualisation. `qiskit-fermions`, actuellement classé bêta, ajoute opérateurs, circuits fermioniques, mappings et transpilation fermion-vers-qubit.
- TorchQuantum vise les circuits quantiques différentiables dans l'écosystème PyTorch, avec autograd, traitement en lot et simulation CPU/GPU.
- TensorFlow Quantum combine Cirq, qsim et TensorFlow/Keras pour les modèles hybrides quantique-classique.
- Azure Quantum est une couche d'accès à plusieurs fournisseurs et une famille d'outils QDK/QIR. Son Resource Estimator compare notamment architectures, codes de correction d'erreurs, qubits physiques et temps d'exécution.
- Le poste de développement est Windows. Le cœur de `qiskit-fermions` publie des roues Windows, mais son extra de simulation `ffsim` est exclu sous Windows. TensorFlow Quantum indique officiellement une matrice testée sous Linux.

## Research Questions

1. `qiskit-fermions` est-il assez mûr pour servir de fondation unique?
2. Une interface commune peut-elle gérer Qiskit, TorchQuantum, TensorFlow Quantum et Azure sans masquer leurs différences?
3. Quelle fonction WebMCP apporte une valeur propre au navigateur et à l'agent?
4. Comment mesurer qu'un appel quantique inutile a réellement été évité?

## Findings

### 1. `qiskit-fermions` est un excellent cas avancé, mais une fondation trop étroite

**Confirmé par sources primaires.** Le projet fournit un pipeline fermionique cohérent et moderne : représentation parcimonieuse des opérateurs, conservation des groupes de termes, circuits fermioniques, mapping à la synthèse et sortie en `QuantumCircuit`. Il conserve ainsi l'information du problème plus longtemps que le workflow qui applique Jordan-Wigner avant de construire le circuit.

Le projet est toutefois en bêta, dépend de Qiskit 2.5, et certaines fonctions de circuits/transpilation restent Python-only. Son intégration de simulation `ffsim` n'est pas disponible dans le chemin Windows testé. Il est donc assez mûr pour un adaptateur et une démonstration forte, mais pas assez universel pour porter seul un produit quatre-frameworks.

### 2. Les quatre surfaces ne sont pas quatre moteurs interchangeables

**Confirmé par sources primaires.**

| Surface | Force propre | Unité de travail naturelle | Risque d'une abstraction naïve |
|---|---|---|---|
| Qiskit / Fermions | circuits, transpilation, primitives, fermions | circuit, observable, target, primitive | perdre les passes et la structure fermionique |
| TorchQuantum | PyTorch, gradients, lots, GPU | module différentiable, batch, loss | réduire un entraînement à une simple exécution de circuit |
| TensorFlow Quantum | Cirq + TensorFlow/Keras | tenseur de circuits, couche PQC, observable | perdre la sémantique Keras et les différenciateurs |
| Azure Quantum | fournisseurs, QIR, profils cible, estimation | programme, target profile, provider, job | confondre courtage matériel, compilation et framework QML |

L'interface commune doit donc normaliser l'intention, les exigences et le rapport, pas convertir silencieusement tout code en une pseudo-API universelle.

### 3. L'angle WebMCP le plus utile est le préflight avant exécution

**Inféré depuis plusieurs sources primaires.** Les quatre surfaces disposent de moyens différents pour construire, compiler, simuler ou estimer, mais le navigateur peut présenter un même contrat de décision : inspecter l'expérience, vérifier sa compatibilité, comparer les chemins disponibles, simuler localement lorsque possible, puis demander un consentement explicite avant tout job distant.

Un « appel inutile » doit être défini précisément :

- job impossible sur le profil ou le jeu de portes de la cible;
- job distant dont un simulateur local suffit à répondre à la question;
- répétition d'un circuit, d'un code, de paramètres et d'un seed déjà exécutés;
- lancement sans observable, shots, budget ou critère de succès défini;
- comparaison inter-framework invalide parce que les modèles ou mesures diffèrent;
- QPU lancé avant transpilation, syntax check ou estimation de ressources;
- appel LLM supplémentaire alors qu'un résultat déterministe existe déjà dans le registre.

### 4. Contrat proposé : Quantum Experiment Manifest

**Recommandation architecturale.** Le noyau ne doit pas stocker un circuit universel, mais un manifeste d'expérience :

- objectif scientifique et question mesurée;
- framework et version;
- représentation native et hash d'artefact;
- nombre de qubits/modes, paramètres, observables et shots;
- besoin de gradients, batching, dynamique ou mesures en cours de circuit;
- cible souhaitée, contraintes de portes/connectivité et profil QIR;
- seed, tolérance, budget, délai et politique de consentement;
- provenance des données et résultats antérieurs comparables.

Chaque adaptateur traduit ce manifeste vers ses propres vérifications. Le rapport commun conserve les résultats natifs et marque toute métrique non comparable.

## Ten Distinct MVPs

### 1. Quantum Call Gate — recommandé

Analyse un manifeste, puis retourne `execute`, `simulate_first`, `recompile`, `reuse_result` ou `reject`, avec preuves. Il appelle les adaptateurs Qiskit, TorchQuantum, TFQ et Azure sans prétendre les fusionner. Originalité élevée; faisabilité hackathon élevée si l'exécution distante reste désactivée par défaut.

### 2. Four-Surface Circuit Concierge

À partir d'une intention, recommande la surface pertinente : Qiskit pour compilation/primitives, TorchQuantum pour entraînement PyTorch, TFQ pour pipeline Keras/Cirq, Azure pour ciblage multi-fournisseur ou estimation tolérante aux fautes. Produit un plan, sans exécuter. Très faisable, mais moins probant scientifiquement.

### 3. Fermion-to-Qubit Compilation Clinic

Construit un petit modèle de Fermi-Hubbard, conserve la structure fermionique, compile avec `qiskit-fermions`, compare profondeur, CX et fidélité à un chemin de mapping anticipé. C'est le meilleur démonstrateur scientifique spécialisé, mais il ne couvre naturellement que Qiskit.

### 4. Quantum Report Deduplicator

Hash du code, du circuit, des paramètres, de la cible, du seed et de l'environnement; cherche un résultat équivalent avant toute nouvelle exécution. Produit une section « preuve déjà disponible ». Valeur immédiate pour éviter les répétitions; originalité forte.

### 5. Simulator-Before-QPU Guardian

Impose des gates : validation statique, compilation, petite simulation locale, syntax checker/provider emulator, puis seulement QPU. Compare la question scientifique aux preuves obtenues à chaque étage et arrête dès que le critère est satisfait.

### 6. Cross-Framework Experiment Auditor

Compare deux expériences provenant de frameworks différents et indique quelles dimensions sont réellement comparables : circuit logique, observable, shots, bruit, gradients, précision et cible. Il refuse un classement global trompeur.

### 7. Quantum Capability Router

Interroge dynamiquement les capacités installées et les profils cible, puis expose progressivement seulement les outils compatibles. Il réduit à la fois les erreurs d'appel et le contexte WebMCP envoyé à l'agent.

### 8. Budget-Aware Quantum Planner

Estime coût, files d'attente, shots, ressources classiques et, avec Azure Resource Estimator, besoins tolérants aux fautes. Il recommande la preuve la moins coûteuse qui répond encore à la question. Les prix réels exigeraient des données fournisseur fraîches.

### 9. Reproducible Quantum Evidence Pack

Après exécution, exporte manifeste, versions, hashes, circuit natif, circuit compilé, résultats, graphiques et limites. Avant exécution, il vérifie si le futur rapport serait incomplet ou non reproductible et peut bloquer l'appel.

### 10. Browser Quantum Lab Notebook

Orchestre les quatre actions quotidiennes : construire, compiler, exécuter, visualiser. Chaque cellule devient une capacité WebMCP, mais l'état scientifique demeure dans un registre explicite. C'est le produit le plus spectaculaire, mais trop large pour un premier hackathon sauf si limité à un seul golden path.

## Recommended Path

Construire **Quantum Call Gate** avec quatre adaptateurs en lecture/analyse et un seul golden path exécutable localement. Ajouter le **Fermion-to-Qubit Compilation Clinic** comme démonstration experte Qiskit.

Outils WebMCP minimaux :

1. `inspect_quantum_experiment` — construit le manifeste depuis les artefacts explicitement sélectionnés.
2. `check_quantum_compatibility` — retourne les diagnostics des quatre adaptateurs.
3. `plan_minimum_evidence_path` — ordonne cache, validation, compilation, simulation, estimation et éventuelle exécution.
4. `generate_quantum_preflight_report` — produit décision, coûts observables, hypothèses et limites.
5. `execute_approved_quantum_step` — séparé, non read-only, soumis à consentement et à un plafond; hors MVP initial si le temps est court.

Le chemin de démonstration : sélectionner un petit Fermi-Hubbard, le compiler avec `qiskit-fermions`, détecter qu'une simulation locale répond déjà à la question de comparaison de ressources, puis éviter un job distant. Le même manifeste est présenté aux trois autres adaptateurs, qui expliquent honnêtement pourquoi ils sont non applicables ou quelles transformations seraient nécessaires.

Mesures de réussite : nombre d'appels distants évités, faux blocages, jobs incompatibles détectés, temps de préflight, réutilisation de résultats, qualité du rapport et traçabilité de chaque décision.

## Alternatives Considered

- Un éditeur générique de portes : utile, mais déjà courant et peu distinctif.
- Une conversion universelle des quatre frameworks : trop risquée; les sémantiques de gradients, batching, observables et cibles ne sont pas équivalentes.
- Un produit exclusivement `qiskit-fermions` : scientifiquement intéressant, mais marché et démonstration plus étroits.
- Exécuter Qiskit entièrement dans le navigateur : environnement CPython/Rust/WebAssembly non garanti et inutile pour prouver la valeur WebMCP.
- Soumettre directement aux QPU : coûts, comptes, files d'attente et reproductibilité rendent ce choix mauvais pour le premier MVP.

## Risks / Unknowns

- La « compatibilité » doit être versionnée et prouvée par chaque adaptateur.
- Les estimations de coût et de file d'attente peuvent devenir périmées rapidement.
- Une simulation réussie ne prouve pas qu'un QPU est inutile pour toute question scientifique.
- Les conversions OpenQASM/QIR peuvent perdre des fonctions propres aux frameworks.
- TFQ est officiellement testé sous Linux; TorchQuantum affiche encore des contraintes de versions historiques; les adaptateurs doivent être isolés.
- Same-origin et annotations WebMCP ne garantissent pas la vérité du contenu. Les outils déterministes gardent l'autorité sur les calculs; le modèle ne doit jamais fabriquer une métrique.

## Sources

- Qiskit Fermions repository: https://github.com/Qiskit/qiskit-fermions
- Qiskit Fermions package configuration: https://github.com/Qiskit/qiskit-fermions/blob/main/pyproject.toml
- Qiskit Fermions circuit guide: https://github.com/Qiskit/qiskit-fermions/blob/main/docs/guides/circuit.rst
- Qiskit Fermions transpilation guide: https://github.com/Qiskit/qiskit-fermions/blob/main/docs/guides/transpilation.rst
- Qiskit Fermions 1D Fermi-Hubbard guide: https://github.com/Qiskit/qiskit-fermions/blob/main/docs/guides/1d_fermi_hubbard.rst
- Qiskit primitives: https://quantum.cloud.ibm.com/docs/en/api/qiskit/2.3/primitives
- Qiskit transpilation: https://quantum.cloud.ibm.com/docs/en/guides/transpile
- TorchQuantum: https://github.com/mit-han-lab/torchquantum
- TensorFlow Quantum: https://www.tensorflow.org/quantum
- TensorFlow Quantum repository: https://github.com/tensorflow/quantum
- Azure Quantum providers: https://learn.microsoft.com/en-us/azure/quantum/qc-target-list
- Azure Quantum target profiles: https://learn.microsoft.com/en-us/azure/quantum/quantum-computing-target-profiles
- Microsoft Quantum Resource Estimator: https://learn.microsoft.com/en-us/azure/quantum/overview-resources-estimator
- Chrome WebMCP: https://developer.chrome.com/docs/ai/webmcp
- WebMCP best practices: https://developer.chrome.com/docs/ai/webmcp/best-practices
- Secure WebMCP tools: https://developer.chrome.com/docs/ai/webmcp/secure-tools
