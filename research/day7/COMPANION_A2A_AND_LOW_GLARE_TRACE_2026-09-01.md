# Day 7 coding trace — Companion A2A and low-glare Light mode

Date: 2026-09-01
Timezone: America/Toronto
Decision owner: Jean-Sébastien Beaulieu
State: implementation and automated contrast validation complete; runtime reload pending

## Observation

After reloading and pinning the unpacked extension, the canonical QCG page
successfully opened the Companion side panel. Jean-Sebastien recognized that
this surface is more important than the initial design suggested: it is the
visible place where browser-bound agents can exchange observations, challenges,
review requests and sanitized handoffs while sharing the same QCG context.

This is the practical A2A idea discussed throughout the hackathon week. The
Companion does not merge agent identities or authority. It makes their bounded
contributions legible beside the page and leaves dispositions with the human.

## Accessibility feedback

Jean-Sebastien reported that the Companion's original Light theme was so bright
that it blurred visual focus. The issue was concentrated by the persistent,
narrow side-panel geometry: a near-white surface remains beside the main browser
viewport rather than appearing only briefly.

## Coding decision

- Preserve Dark and Light as the only two Companion themes.
- Replace the Light background and surfaces with sage-mineral neutrals.
- Remove pure white from the primary Companion surface.
- Preserve deep text and semantic emerald, cyan, gold and red accents.
- Require at least 7:1 foreground contrast, 4.5:1 semantic text contrast and
  3:1 component-boundary contrast on both the background and primary surface.
- Keep A2A contracts, permissions, commands and human authority unchanged.

## Claim boundary

This change responds to one author's direct visual experience and passes bounded
token-level contrast checks. It improves the Light theme without constituting a
general accessibility certification or a substitute for broader assistive-
technology testing.

## Validation receipt

- Companion version: `0.2.2`.
- MV3 manifests, restricted hosts and command allowlist: PASS.
- Trusted-click Companion handshake and synthetic-click rejection: PASS.
- Light background relative luminance ceiling: PASS.
- Light primary-surface relative luminance ceiling and no pure white: PASS.
- Main text contrast on background and surface: at least 7:1, PASS.
- Muted and semantic text accents: at least 4.5:1, PASS.
- Functional component boundaries: at least 3:1, PASS.
- Final side-panel visual review: pending one unpacked-extension reload.

## Runtime follow-up

Later on 2026-09-01, Jean-Sebastien reloaded the unpacked extension, restarted
Chrome, pinned the QCG extension and opened the Companion from the canonical QCG
page. The side panel opened successfully and its shared QCG context was visible.

This closes the narrow reload/opening gate. Final release and video QA still need
to repeat the same interaction on the retained recording tab and preserve the
same session evidence.
