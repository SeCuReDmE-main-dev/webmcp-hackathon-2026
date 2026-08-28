# FNP-QNN — analyse de transfert vers le Quantum Call Gate

Date : 2026-08-27  
Mode : audit en lecture seule; aucun couplage entre produits

## Décision

**Réutiliser les patrons de contrat et de preuve, pas la sémantique neutrosophique ni le moteur FNP-QNN.** Le projet source contient plusieurs mécanismes architecturaux directement pertinents pour un routeur WebMCP, mais ses transformations `T/dF/F`, ses gates inspirées du quantique et ses surfaces expérimentales ne constituent pas une implémentation de calcul quantique physique.

## Patrons transférables

### 1. Action map avant interface

L'`ACTION_MAP` inventorie chaque capacité, son point d'entrée, son niveau de risque, sa preuve et son traitement d'interface avant d'exposer des boutons. Pour le Quantum Call Gate, le même patron devient une carte de capacités par adaptateur : inspection, validation, simulation locale, compilation, estimation, exécution distante et lecture de résultats.

### 2. États d'exposition explicites

Les labels `stable_contract`, `experimental_hidden` et `disabled_unsafe` sont utiles. Ils empêchent qu'une capacité simplement présente dans le code devienne automatiquement un outil WebMCP. Le MVP doit ajouter un état propre : `requires_explicit_consent` pour toute exécution distante ou payante.

### 3. Contrats immuables et versionnés

Les dataclasses figées, identifiants de schéma, versions explicites et exports JSON déterministes constituent un bon modèle pour `QuantumExperimentManifest`, `TargetCapabilityProfile` et `PreflightDecision`. Les versions futures inconnues doivent être rejetées plutôt qu'interprétées silencieusement.

### 4. Preuve séparée du résultat

Le schéma FNP-QNN distingue affirmation, texte de preuve, provenance et état d'approbation. Le Quantum Call Gate doit de même séparer résultat scientifique natif, décision du routeur, provenance technique et autorisation opérateur. Une simulation réussie n'autorise pas automatiquement un QPU.

### 5. Gate de readiness et limites de revendication

Le validateur FNP-QNN vérifie fichiers requis, imports, tests, licence, absence de shell public et vocabulaire interdit. Le hackathon doit reprendre ce principe pour vérifier : outils WebMCP bornés, absence de secrets, aucune exécution payante implicite, licences d'adaptateurs, résultats reproductibles et absence de revendication de compatibilité non testée.

## Éléments à ne pas transférer

- Les gates `T/dF/F` ne doivent pas être présentées comme des gates quantiques physiques.
- Les transformations Hadamard/Pauli neutrosophiques ne doivent pas alimenter une décision de circuit Qiskit, Q# ou QPU.
- Les routes historiques, commandes, écritures registre, boucles runtime et dépendances du simulateur restent hors du hackathon.
- Aucun vocabulaire clinique, biologique ou théorique de FNP-QNN n'entre dans l'interface quantique.
- Le dépôt FNP-QNN ne devient ni dépendance, ni sous-module, ni service du Quantum Call Gate.

## Contrat dérivé pour le MVP

Chaque outil reçoit exactement une classe d'exposition :

| Classe | Usage Quantum Call Gate | Traitement WebMCP |
|---|---|---|
| `inspect_readonly` | lire manifeste, capacité ou preuve | visible, sans effet durable |
| `validate_deterministic` | syntaxe, cible, bornes, compatibilité | visible, résultat reproductible |
| `simulate_bounded` | petite simulation locale explicitement bornée | visible après validation |
| `experimental_hidden` | adaptateur incomplet ou environnement non prouvé | non découvert par défaut |
| `requires_explicit_consent` | appel distant, job, QPU ou coût | séparé et hors MVP initial |
| `disabled_unsafe` | shell arbitraire, secret, job non borné | jamais exécutable |

## Conclusion de transfert

FNP-QNN nous fait gagner du temps sur la discipline de surface : cartographier, borner, versionner, prouver et refuser. Il ne nous fournit pas le moteur quantique. Le QDK/WASM fournit la première simulation réelle; le Quantum Call Gate fournit la décision et l'observabilité WebMCP.

## Sources locales inspectées

- `docs/action-map/ACTION_MAP.md`
- `docs/action-map/PANEL_FUNCTIONS.md`
- `core/evidence_schema.py`
- `core/education_run_contract.py`
- `core/education_manifest.py`
- `scripts/validate_alpha_readiness.py`
- étude NeutroBit : `02_NEUTROBIT_GATE_FIT_ANALYSIS.md`
- prototype NeutroBit : `neural_network/neutrosophic_gates.py` et ses tests

