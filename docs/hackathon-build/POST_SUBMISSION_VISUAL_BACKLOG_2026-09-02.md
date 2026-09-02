# Post-submission visual refinement

Status: `DEFERRED_BY_AUTHOR`

Jean-Sébastien fixed the execution order on 2026-09-02 after the overnight release pass:

1. finish the stable technical candidate;
2. sleep;
3. record the final video after waking;
4. submit Devpost under Jean-Sébastien's authority;
5. refine the following visual details after submission.

## Deferred visual details

- Restore the approved warm orange/gold control edge from the Companion side panel across the Web surface. The Companion source of truth uses `--control-edge` and preserves cyan hover plus emerald active states.
- Refine the Web background from the supplied identity pack under `asset/logo`, especially `hero web bg.png`, `header light.png`, `header dark.png`, `badges light.png`, and `badges dark.png`.
- Reduce sustained Light-theme glare. Jean-Sébastien reported visual fatigue after prolonged viewing; the refinement must use the calmer Companion Light palette and remove the hard-coded blue grid stroke from the Web canvas.
- Re-run browser visual QA in Dark and Light at mobile, tablet, laptop, and wide-desktop widths after the refinement.

## Diagnosis retained for the next pass

- This is source-level design drift, not Vercel/cPanel drift.
- Companion controls already use the approved warm edge; Web controls still use the generic line token.
- Web Dark tokens diverge from the refined Companion palette.
- The Web grid uses a hard-coded blue stroke in both themes, which keeps the Light center brighter and visually busier than the Companion.

These items are deliberately excluded from the stable pre-video candidate so the final overnight technical closeout does not introduce an unreviewed visual regression.
