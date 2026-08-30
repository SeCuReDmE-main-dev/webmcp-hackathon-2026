# WebMCP-QCG — Spring editorial quantum-botany art direction

Status: canonical graphics direction for Day 5, 2026-08-30
Behavioral authority: [`DESIGN.md`](./DESIGN.md)
Historical visual references: [`STITCH_PROMPT.md`](./STITCH_PROMPT.md), [`STITCH_ASSET_TRIAGE.md`](./STITCH_ASSET_TRIAGE.md)

This document supersedes the graphics direction only. It does not supersede the existing interaction contract, component behavior, tool names, state machine or accessibility requirements in `DESIGN.md`. It is a visual specification for redrawing the existing QCG UI and DOM.

## No-deploy and parity gate

This is a concept document for author review. Do not modify source CSS/components, build output, hosting configuration or deployments from this direction. Do not recommend promoting Spring graphics to Vercel or `qcg.securedme.ca` until Jean-Sébastien explicitly approves the art direction. Before any future promotion, the candidate artifact must be byte/hash mapped and verified to serve the same intended release on both public surfaces; a stale, expired or mismatched surface blocks promotion.

## Visual thesis

Spring is an editorial quantum-botany workbench: a quiet mineral instrument in which a living tree and a decision gate share one provenance system. The tree is physically plausible and species-aware; circuit/provenance lines emerge from real branch junctions and return to labelled evidence nodes. The visual should feel researched, tactile and architectural rather than like generic technology art.

The gate remains the centre of the composition. Botanical growth frames and guides attention toward it; it never becomes a second product or a decorative dashboard. Evidence, review, consent and receipt remain readable above the atmosphere.

## What remains invariant

- Preserve the working QCG DOM, routes, five tabs, four tools, five hypotheses, controls, labels, state machine and source-labelled ledger.
- Preserve the four presentation themes: Autumn, Winter, Spring and Summer. Spring is the current art direction; theme selection changes tokens and imagery, never behavior.
- Preserve empty, partial, active, completed, cancelled, error and recovery states.
- Preserve the visible human authority boundary, locked `external — human controlled` stage, and all existing limits.
- Preserve keyboard navigation, semantic landmarks, text alternatives, 3 px focus ring, reduced-motion behavior and responsive order from `DESIGN.md`.

## Spring composition

Use an asymmetric editorial frame at a 1280 px maximum workbench width:

1. A compact masthead establishes `SecuredMe / WebMCP-QCG`, `Decide before quantum execution.` and `Working browser prototype`.
2. A narrow left provenance rail carries source labels and the five-stage gate rail: `TRUST → INSPECT → DECIDE → VERIFY → EXECUTE`; the final stage stays visibly locked.
3. The central gate chamber contains the real tab content and a restrained evidence-cube motif. It receives the strongest contrast and the widest text measure.
4. A right evidence rail carries `Artifact Integrity`, `Target Evidence` and `Authority & Effects` as real existing cards. A botanical branch can frame this rail, but cannot obscure a control.
5. The five-scenario deck appears as a partial, readable edge in the first viewport. It remains real application content, not an illustration legend.

Use mineral ivory, mist blue, fresh cyan, leaf green and restrained warm gold. Keep text on opaque or sufficiently dense surfaces. Use 1 px hairline borders, 12–16 px radii, 8 px spacing rhythm and light layered shadows. Avoid a full-page photographic background.

## Physically plausible tree direction

Draw or commission a detailed deciduous tree with botanical logic:

- one visible trunk with believable taper, buttress flare and bark fissures;
- primary boughs that fork with decreasing diameter and natural asymmetry;
- secondary twigs attached at plausible branch collars, with no floating stems;
- spring leaf clusters arranged along twigs with varied scale, spacing and orientation;
- a restrained understorey of moss, wet stone or fine grass only when it supports depth;
- light entering through the canopy, with contact shadows where branch layers overlap;
- no impossible mirror symmetry, neon foliage, stock tree silhouette, emoji, clip-art icon or isolated “tree” pictogram.

The tree is a visual anchor, not a data visualization. It must not encode metrics by leaf count, pulse, colour temperature or growth animation.

## Circuit and provenance integration

Integrate the technical layer as engineered linework that respects the tree’s geometry:

- trace a small number of circuit-like paths along real branch junctions, with controlled 90-degree transitions only where a measurement/evidence node is declared;
- use copper/gold or cyan hairlines for provenance, never a glowing web across the entire sky;
- place tiny labelled nodes at `human`, `webmcp`, `worker` and `export` handoff points;
- let the evidence cube sit near the gate seam as a wireframe receipt motif, not as a quantum computer;
- keep line weights and contrast stable in static mode; animation is optional atmosphere and carries no state meaning;
- show the relationship `artifact → target snapshot → recommendation → human choice → receipt` as text plus linework.

No line may imply a QPU route, provider call, network activity, scientific certainty or a hidden execution path. No visual may add a metric, signature, capability, counter or `Execute` control.

## Four-season continuity

All four themes use the same composition, CSS tokens and DOM:

| Theme | Botanical treatment | Technical line treatment | Palette intent |
|---|---|---|---|
| Autumn | mature copper leaves, dry grasses, visible bark | copper provenance lines | plum, graphite, rust, amber, ivory |
| Winter | bare branching, frost and snow load with believable weight | ice-blue hairlines | ice white, cool blue, cobalt, frosted gold |
| Spring | fresh leaf flush, rain-dark bark, damp stone and new growth | cyan/leaf-green lines with warm-gold nodes | pale mineral, cyan, leaf green, soft gold |
| Summer | full canopy, warm directional light and deeper green | electric blue/cyan lines | QCG navy, electric blue, cyan, metallic gold |

Contrast variants are token adjustments inside these four themes. There is no fifth dark/light/premium/DevTools theme.

## Responsive and accessibility art direction

- Desktop (1280–1440 px): asymmetric three-rail composition, central chamber, full evidence cards and five-card deck.
- Tablet (768–1199 px): keep the botanical frame at the edges, stack rails below the chamber and retain full labels in the scrollable tab row.
- Mobile (320–767 px): crop or simplify the tree to a single believable branch edge; preserve semantic order, security cards and controls; never place essential text over imagery.
- Every meaningful botanical or circuit image receives descriptive alternative text; decorative layers use empty alt text and are removed from the accessibility tree.
- Provide a static reduced-motion variant with no growth, shimmer, orbit or pulsing. Focus and status remain visible through text and borders.

## Stitch usage and asset custody

The inspected `asset/.stitch/template/printemps.png` is a 1024×1536 portrait reference with leafy branches framing a pale architectural gate, reflective wet ground and a sparse white technical constellation. `hiver.png` is the same portrait family with bare snow-weighted branches, ice and a colder palette. Their SHA-256 values and custody remain in the asset manifest/evidence lane; they are references, not production UI.

The private Stitch archive remains intact and ignored. Redraw any adopted composition as editable HTML/CSS/SVG against the working app. Do not extract raw screens, generated HTML, covers or icons into public assets.

## Acceptance checklist

- The existing QCG behavior is unchanged and the new direction names no invented functionality.
- Spring has a physically plausible tree and legible gate/provenance relationship.
- All four seasons remain selectable with identical structure and semantics.
- No generic clip-art tree, fake metric, fake QPU, provider logo, `Execute` control or ornamental telemetry appears.
- Desktop, tablet, mobile, keyboard, contrast and reduced-motion states remain specified.
- The Stitch archive and historical prompts are preserved; this file is the canonical Day 5 graphics supplement.
- No-deploy/no-source-change gate is recorded, and stable-release parity is a prerequisite for any later promotion.
