# WebMCP–CCP — corpus primaire de 60 sources

Date d’accès et de vérification : 2026-08-20.

## Objective

Constituer un corpus de exactement 60 sources distinctes pour l’éditorial WebMCP–CCP : 30 sources pour la théorie des neuf chapitres et 30 sources pour les neuf sessions de codage et de test. Le corpus doit aussi permettre de décider quel Chrome Origin Trial activer sans confondre WebMCP, Prompt API et Web Crypto.

## Environment / Stack Context

- Dépôt canonique WebMCP gelé à `fca7462d703c628f4cf110ddadd51e8e5b52a579`.
- Laboratoire externe Node.js, sans dépendance tierce, servi par défaut sur `http://localhost:8787`.
- Contrat expérimental : `ccp.webmcp.experiment.v1`, 8 KiB maximum, TTL maximal de 24 heures, digest vérifiable, état same-origin et contenu traité comme non fiable.
- État avant inscription : 13 tests Node réussis; `document.modelContext` absent lors de la sonde Chrome 151 sans activation WebMCP valide.
- Origin Trial WebMCP enregistré le 2026-08-20 pour `http://localhost:8787`; le jeton demeure hors de ce rapport.

## Research Questions

1. Quelles sources définissent correctement les frontières entre WebMCP, MCP, page, navigateur et harness agentique?
2. Quelles sources permettent de défendre provenance, fraîcheur, annulation, origine, sécurité et mesure contextuelle?
3. Quelles références donnent des procédures reproductibles pour chacune des neuf sessions?
4. Quel Origin Trial active réellement `document.modelContext` pour le laboratoire?

## Findings

- **confirmed by primary sources** — WebMCP est une incubation de Community Group et sa surface actuelle est liée au `Document`; il ne constitue ni une mémoire d’agent ni une implémentation JavaScript de MCP.
- **confirmed by primary sources** — L’Origin Trial requis est `WebMCP`, ID `4163014905550602241`, actif de Chrome 149 à 156. Aucun essai copié par l’utilisateur sous un autre nom ne remplace celui-ci.
- **confirmed by primary sources** — `Prompt API Sampling Parameters` sert au réglage d’échantillonnage; il n’active ni `document.modelContext` ni la découverte WebMCP.
- **confirmed by primary sources** — `Additional WebCrypto Algorithms` est inutile pour SHA-256; le CCP utilise le digest Web Crypto déjà standard.
- **confirmed by primary sources** — Une API disponible dans la page ne prouve pas qu’un panneau agent sait découvrir l’outil. L’API, l’inspection déterministe et chaque intégration produit doivent être évaluées séparément.
- **tentative due to conflicting or missing evidence** — Le support WebMCP natif d’Edge, du panneau ChatGPT/Chrome et d’Antigravity doit être établi par sonde réelle; CDP ou contrôle d’onglet ne suffit pas.

## Recommended Path

1. Utiliser l’inscription WebMCP same-origin créée pour `http://localhost:8787`.
2. Garder third-party matching et correspondance de sous-domaines désactivés.
3. Pour valider réellement le jeton, désactiver le flag local WebMCP avant la sonde finale afin qu’il ne masque pas une erreur d’activation.
4. Vérifier successivement : jeton valide dans DevTools, `document.modelContext`, enregistrement, inspection/exécution manuelle, puis découverte par chaque produit.
5. Utiliser les sources T01–T30 pour l’argumentation éditoriale et C01–C30 comme références opératoires pendant les sessions.

## Alternatives Considered

- Flag `chrome://flags/#enable-webmcp-testing` : utile comme contrôle local sans jeton, mais insuffisant pour qualifier un résultat d’Origin Trial.
- Prompt API Sampling Parameters : rejeté, car hors du chemin WebMCP.
- Additional WebCrypto Algorithms : rejeté, car les algorithmes PQ additionnels ne sont pas utilisés.
- Jeton third-party : rejeté pour le premier protocole same-origin.

## Risks / Unknowns

- WebMCP reste expérimental et peut changer avant Chrome 156.
- Les Community Group Reports et issues ouvertes ne constituent pas un consensus W3C.
- Un digest confirme l’intégrité d’octets canoniques; il ne garantit ni vérité ni autorité.
- Le corpus justifie l’expérience, mais les affirmations de performance doivent provenir exclusivement des mesures du laboratoire.
- La prise en charge par un navigateur Chromium ne garantit aucune intégration dans un produit agentique donné.

## Sources — théorie essentielle des neuf chapitres (30)

| ID | Source primaire | Usage éditorial | Chapitre(s) | Confiance |
|---|---|---|---:|---|
| T01 | [WebMCP — Draft Community Group Report](https://webmachinelearning.github.io/webmcp/) | Frontière normative, `Document`, origine, annotations et cycle de vie. | 1, 3, 4, 6, 9 | confirmed by primary sources; brouillon CG |
| T02 | [WebMCP API Proposal historique](https://webmachinelearning.github.io/webmcp/docs/proposal.html) | Comparer la proposition initiale avec l’API devenue publique. | 1, 2, 9 | confirmed by primary sources; historique |
| T03 | [PR #1 — Add initial explainer](https://github.com/webmachinelearning/webmcp/pull/1) | Point de départ public du 6 août 2025 et premier modèle de contribution. | 1, 9 | confirmed by primary sources |
| T04 | [WebMCP CONTRIBUTING.md](https://github.com/webmachinelearning/webmcp/blob/main/CONTRIBUTING.md) | Conditions de contribution et rôle du Community Group. | 1, 9 | confirmed by primary sources |
| T05 | [W3C Community and Business Group Process](https://www.w3.org/community/about/process/) | Distinguer incubation communautaire et standard W3C. | 1, 9 | confirmed by primary sources |
| T06 | [WebMCP Best Practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) | Outils atomiques, descriptions claires, coût contextuel et évaluation. | 3, 4, 5, 8 | confirmed by primary sources |
| T07 | [WebMCP Tool Security](https://developer.chrome.com/docs/ai/webmcp/secure-tools) | Injection indirecte, hints non normatifs, confirmation et minimisation. | 3, 4, 6, 7, 8 | confirmed by primary sources |
| T08 | [Evals for WebMCP](https://developer.chrome.com/docs/ai/webmcp/evals) | Séparer tests déterministes et évaluations probabilistes. | 5, 6, 7, 8 | confirmed by primary sources |
| T09 | [Issue #29 — Agent memory](https://github.com/webmachinelearning/webmcp/issues/29) | Antériorité de la question mémoire/ressource et demande de preuves. | 2, 3, 9 | confirmed by primary sources; proposition ouverte |
| T10 | [Issue #231 — Context thrashing](https://github.com/webmachinelearning/webmcp/issues/231) | Coût des observations répétées et frontière produit/harness. | 1, 5, 8, 9 | confirmed by primary sources; objection ouverte |
| T11 | [Issue #232 — Sessions and compaction](https://github.com/webmachinelearning/webmcp/issues/232) | Ambiguïté de propriété des sessions et de la compaction. | 3, 5, 8, 9 | confirmed by primary sources; proposition ouverte |
| T12 | [MCP Architecture 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/architecture) | Responsabilités du host, des clients et des serveurs. | 2, 3, 4, 7 | confirmed by primary sources |
| T13 | [MCP Server Overview 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/index) | Contrôle respectif des prompts, ressources et outils. | 2, 3, 4, 9 | confirmed by primary sources |
| T14 | [MCP Tools 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | Contrats, schémas, résultats, annotations et validation. | 3, 4, 6, 7 | confirmed by primary sources |
| T15 | [MCP Resources 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/resources) | Comparer outil appelable et ressource applicative. | 2, 3, 8, 9 | confirmed by primary sources |
| T16 | [MCP Security Best Practices 2025-11-25](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices) | Moindre privilège, confused deputy, sessions et token passthrough. | 3, 4, 6, 7, 9 | confirmed by primary sources |
| T17 | [MCP Authorization 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | Séparer contexte transporté, identité et autorité. | 3, 4, 6 | confirmed by primary sources |
| T18 | [MCP Cancellation 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/cancellation) | Modèle d’annulation coopérative et libération des ressources. | 4, 6 | confirmed by primary sources |
| T19 | [RFC 8259 — JSON](https://www.rfc-editor.org/rfc/rfc8259.html) | Sémantique et limites du format d’échange du CCP. | 3, 5, 8 | confirmed by primary sources |
| T20 | [PROV-DM](https://www.w3.org/TR/prov-dm/) | Modéliser entité, activité et agent sans confondre provenance et vérité. | 3, 8 | confirmed by primary sources |
| T21 | [RFC 8785 — JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785.html) | Représentation déterministe avant calcul du digest. | 3, 5, 8 | confirmed by primary sources; RFC informatif |
| T22 | [Web Cryptography Level 2](https://www.w3.org/TR/webcrypto-2/) | Intégrité SHA-256 et limite conceptuelle du digest. | 3, 5, 6 | confirmed by primary sources; brouillon W3C |
| T23 | [RFC 3339 — Internet Timestamps](https://www.rfc-editor.org/rfc/rfc3339.html) | `createdAt`, `expiresAt` et règles de fraîcheur interopérables. | 3, 5, 8 | confirmed by primary sources |
| T24 | [HTML Living Standard — Origins](https://html.spec.whatwg.org/multipage/browsers.html#origin) | L’origine comme frontière d’autorité et de méfiance. | 1, 3, 4, 6, 7 | confirmed by primary sources |
| T25 | [Permissions Policy](https://www.w3.org/TR/permissions-policy/) | Délégation sélective de capacités et valeur par défaut `self`. | 1, 4, 6, 7 | confirmed by primary sources; brouillon W3C |
| T26 | [DOM Standard — AbortSignal](https://dom.spec.whatwg.org/#abortsignal) | Cycle de vie, raison d’annulation et composition des signaux. | 4, 6 | confirmed by primary sources |
| T27 | [OWASP LLM01 — Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | Injection indirecte, séparation des contenus et contrôle humain. | 3, 4, 5, 6, 7 | confirmed by primary sources |
| T28 | [NIST AI 600-1 — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | Intégrité de l’information, chaîne de garde, validité et surconfiance. | 3, 5, 7, 9 | confirmed by primary sources |
| T29 | [Prompt API — Draft Community Group Report](https://webmachinelearning.github.io/prompt-api/) | `measureContextUsage`, `contextUsage` et `contextWindow` comme comparaison observable. | 5, 7, 8 | confirmed by primary sources; brouillon CG |
| T30 | [When to use WebMCP and MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp) | Frontend éphémère WebMCP versus service MCP persistant. | 1, 2, 4, 9 | confirmed by primary sources |

## Sources — neuf sessions de codage et de test (30)

| ID | Source primaire | Usage de codage ou de test | Session(s) | Confiance |
|---|---|---|---:|---|
| C01 | [Dépôt WebMCP au commit `fca7462`](https://github.com/webmachinelearning/webmcp/tree/fca7462d703c628f4cf110ddadd51e8e5b52a579) | Inventaire reproductible et base gelée de l’audit. | 1, 9 | confirmed by primary sources |
| C02 | [Security and Privacy Questionnaire à `fca7462`](https://github.com/webmachinelearning/webmcp/blob/fca7462d703c628f4cf110ddadd51e8e5b52a579/security-privacy-questionnaire.md) | Transformer les risques en cas de tests CCP négatifs. | 1, 2, 3, 4, 6 | confirmed by primary sources |
| C03 | [Implementation Status à `fca7462`](https://github.com/webmachinelearning/webmcp/blob/fca7462d703c628f4cf110ddadd51e8e5b52a579/implementation-status.md) | Matrice navigateur et garde contre les inférences de support. | 1, 6, 7 | confirmed by primary sources |
| C04 | [Bikeshed Documentation](https://speced.github.io/bikeshed/) | Construire et contrôler `index.bs`. | 1, 9 | confirmed by primary sources |
| C05 | [Web IDL Living Standard](https://webidl.spec.whatwg.org/) | Auditer interfaces, dictionnaires et types. | 1, 4 | confirmed by primary sources |
| C06 | [Chrome WebMCP Overview](https://developer.chrome.com/docs/ai/webmcp) | Flag local, Origin Trial, isolation d’origine et limitations. | 4, 6, 7 | confirmed by primary sources |
| C07 | [Chrome WebMCP Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) | `registerTool`, `getTools`, `executeTool`, signaux et origines. | 3, 4, 6, 7 | confirmed by primary sources |
| C08 | [Chrome WebMCP Declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api) | Comparateur de surface et justification du choix impératif. | 1, 4, 9 | confirmed by primary sources |
| C09 | [How WebMCP fits in user journeys](https://developer.chrome.com/docs/ai/webmcp/use-cases) | Construire une micro-tâche et un parcours critique réalistes. | 5, 7 | confirmed by primary sources |
| C10 | [JSON Schema 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core) | Déclarer dialecte, vocabulaire et structure du paquet. | 3 | confirmed by primary sources |
| C11 | [JSON Schema 2020-12 Validation](https://json-schema.org/draft/2020-12/json-schema-validation) | Champs requis, limites, formats et cas négatifs. | 3, 5, 8 | confirmed by primary sources |
| C12 | [Encoding Standard — TextEncoder](https://encoding.spec.whatwg.org/#interface-textencoder) | Compter les octets UTF-8 et faire respecter 8 KiB. | 3, 5, 8 | confirmed by primary sources |
| C13 | [Secure Contexts](https://w3c.github.io/webappsec-secure-contexts/) | Vérifier HTTPS, localhost digne de confiance et ancêtres. | 4, 6 | confirmed by primary sources |
| C14 | [Join the WebMCP Origin Trial](https://developer.chrome.com/blog/ai-webmcp-origin-trial) | Identifier le bon essai et son canal de feedback. | 6, 9 | confirmed by primary sources |
| C15 | [Get started with Chrome Origin Trials](https://developer.chrome.com/docs/web-platform/origin-trials) | Déployer et vérifier un jeton lié à l’origine. | 6 | confirmed by primary sources |
| C16 | [Troubleshoot Chrome Origin Trials](https://developer.chrome.com/docs/web-platform/origin-trial-troubleshooting) | Diagnostiquer origine, version, token, iframe et activation. | 6, 7 | confirmed by primary sources |
| C17 | [Chrome Platform Status — WebMCP](https://chromestatus.com/feature/5117755740913664) | Milestones, statut d’implémentation et signaux interop. | 1, 6, 7, 9 | confirmed by primary sources |
| C18 | [Intent to Experiment — WebMCP](https://groups.google.com/a/chromium.org/g/blink-dev/c/gmYffo5WOE8/m/OJxuQRP3AAAJ) | Confirmer l’expérimentation M149–M156 et ses objectifs. | 6, 9 | confirmed by primary sources |
| C19 | [Debug WebMCP tools with Chrome DevTools](https://developer.chrome.com/docs/devtools/application/webmcp) | Inspecter schéma, outils disponibles, appels et erreurs. | 4, 6, 7 | confirmed by primary sources |
| C20 | [WebMCP Model Context Tool Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) | Tester découverte et exécution indépendamment d’un agent produit. | 4, 6, 7 | confirmed by primary sources |
| C21 | [Web Platform Tests — testharness API](https://web-platform-tests.org/writing-tests/testharness-api.html) | `promise_test`, nettoyage et futurs tests interopérables. | 1, 4, 6 | confirmed by primary sources |
| C22 | [Node.js v24 Test Runner](https://nodejs.org/docs/latest-v24.x/api/test.html) | Exécuter les tests, sous-tests et rapports JUnit du laboratoire. | 3, 4, 5, 8 | confirmed by primary sources |
| C23 | [Node.js v24 Web Crypto API](https://nodejs.org/docs/latest-v24.x/api/webcrypto.html) | Implémenter SHA-256 dans le laboratoire Node sans dépendance. | 3, 5, 8 | confirmed by primary sources |
| C24 | [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Lister/exécuter les outils et séparer CDP de WebMCP. | 6, 7 | confirmed by primary sources |
| C25 | [Puppeteer WebMCP Guide](https://pptr.dev/guides/webmcp) | Automatiser découverte, exécution et événements avec Chrome 151+. | 4, 6, 7 | confirmed by primary sources; API expérimentale |
| C26 | [Antigravity Browser Agent Codelab](https://codelabs.developers.google.com/agentic-ui-automation-with-antigravity) | Distinguer automation CDP et consommation WebMCP. | 7 | confirmed by primary sources |
| C27 | [GitHub REST API — Issues](https://docs.github.com/en/rest/issues/issues) | Extraire issues et reconnaître les PR dans cet endpoint. | 2, 9 | confirmed by primary sources |
| C28 | [GitHub REST API — Timeline events](https://docs.github.com/en/rest/issues/timeline) | Reconstruire fermetures, références, doublons et fusions. | 9 | confirmed by primary sources |
| C29 | [GitHub REST API — Pull requests](https://docs.github.com/en/rest/pulls/pulls) | Extraire corps, états, auteurs, commits et fusion. | 2, 9 | confirmed by primary sources |
| C30 | [GitHub REST API — Pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api) | Prouver l’exhaustivité de l’export sans entrée manquante. | 9 | confirmed by primary sources |

## Integrity check

- Sources théoriques : 30.
- Sources de codage/test : 30.
- URL externes dans le corpus T01–T30 et C01–C30 : 60.
- Doublons entre les deux listes : 0.
- Sources secondaires : 0.
- Les documents de CG, working drafts et issues ouvertes sont explicitement qualifiés; aucun n’est présenté comme standard adopté ou consensus mainteneur.
