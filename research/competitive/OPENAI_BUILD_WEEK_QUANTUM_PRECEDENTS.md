# OpenAI Build Week — précédents quantiques construits avec Codex

Date : 2026-08-27  
Statut : recherche concurrentielle partielle, fondée sur les surfaces publiques retrouvées

## Résultat principal

**Confirmé par sources primaires.** Le précédent le plus proche retrouvé est **Sumi — An AI-Native Learning Companion for 1StopQuantum**, présenté à OpenAI Build Week. Le projet déclare employer Codex/GPT-5.6, Qiskit et Cirq, une représentation intermédiaire de circuits, la simulation locale, la visualisation et l'export de code. Son dépôt décrit également un endpoint MCP optionnel et des actions typées limitées à l'écran courant.

**Confirmé par inspection des surfaces publiques consultées.** Ni la page Devpost ni le dépôt public consulté ne documentent une inscription d'outil avec `document.modelContext`, une découverte WebMCP native ou une preuve d'invocation WebMCP. Sumi doit donc être classé comme précédent quantique adjacent utilisant MCP et un SDK local, pas comme précédent WebMCP démontré.

## Effet sur notre choix de produit

Les éditeurs de circuits, tuteurs, conversions Qiskit/Cirq, visualisations et compagnons pédagogiques sont déjà bien représentés. Notre différenciation ne doit pas reposer sur un autre éditeur universel. Le **Quantum Call Gate** traite une autre question : avant d'exécuter, faut-il `execute`, `simulate_first`, `recompile`, `reuse_result` ou `reject`, sur quelle surface, et avec quelle preuve?

La proposition se distingue par :

- le préflight avant toute dépense ou soumission distante;
- la décision multi-backend sans prétendre rendre les frameworks interchangeables;
- la séparation entre simulation inspectable et QPU non inspectable;
- l'observabilité des invocations WebMCP;
- un rapport de preuve expliquant les appels évités et les refus.

## Réutilisation d'un ancien projet dans le WebMCP Challenge

**Confirmé par les règles officielles du WebMCP Challenge.** Un projet préexistant peut participer s'il est significativement étendu avec WebMCP après le début de la période de soumission. Seul le nouveau travail est évalué. Le participant doit distinguer clairement l'ancien du nouveau avec des preuves datées, par exemple l'historique des commits.

Conséquence : Sumi ne pourrait pas être présenté inchangé comme nouveau travail, mais son auteur pourrait soumettre une extension WebMCP substantielle et documentée. Sa participation future demeure inconnue.

## Limites

- La recherche ciblée n'est pas une preuve d'exhaustivité de toute la galerie OpenAI Build Week.
- L'absence de terme WebMCP sur les surfaces inspectées ne prouve pas l'absence de tout prototype privé.
- Aucun renseignement public ne permet d'affirmer que l'auteur de Sumi participera au WebMCP Challenge.

## Sources primaires

- Sumi sur Devpost : https://devpost.com/software/1stopquantum
- Dépôt public Sumi : https://github.com/dlyog/sumi
- Règles officielles du WebMCP Challenge : surface Devpost authentifiée, section « New & Existing », consultée le 2026-08-27

