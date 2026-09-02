# Post-submission Web and Companion visual refinement

Date: 2026-09-02
Status: local candidate validated; deployment not part of this receipt

## Author decisions

- Companion Dark and Light palettes are the visual source of truth.
- Every normal control keeps the warm orange/gold edge at rest, cyan on hover
  and emerald when active. Danger and disabled controls retain their semantic
  red and neutral boundaries.
- The repeated blue Web grid is removed because it caused sustained visual
  fatigue in Light mode.
- `hero web bg.png` is used only through a low-opacity optimized derivative.
- The detailed app medal does not scale to toolbar size. The text-free open
  gate from `logo A — épuré.png` is the compact runtime mark.

## Implemented candidate

- Web Dark tokens match Companion Dark tokens.
- Web Light tokens match the low-glare Companion sage/ivory family.
- Access is an integrated disclosure below the Web header and restores focus
  after Escape or Close.
- The bounded path is an ordered, non-interactive status region:
  `Trust → Inspect → Decide → Verify → Execute`.
- Execute is explicitly titled `Bounded local execution only`.
- Inspector Q remains a decorative bounded-state witness in the evidence rail.
- The ambient JPEG is 1536×864 and 262,360 bytes. Dark high-contrast mode keeps
  it at 18%; Light high-contrast mode keeps it at 16%, so neither theme loses its
  identity when stronger contrast is enabled.
- Production and development Companion ZIPs are regenerated in both public
  locations from the validated extension source.

## Browser observations

Chrome real-browser inspection covered Dark, Light, Access open, a compact
Companion-like width and a 390 px mobile viewport. Cards remained opaque,
horizontal status/navigation rails stayed operable, the left and right rails
adapted at the expected breakpoint, and document width did not overflow at
390 px. Browser console inspection returned no warning or error.

The final Light high-contrast inspection confirmed that the accessibility
profile no longer falls back to pure white. It keeps the Companion-derived
low-glare surfaces, strengthens text and structural
edges, preserves the gold control outline, and adds only a restrained warm
depth cue to cards. This closes the visual regression reported during the
post-submission manual review.

The follow-up Light interaction pass increased the canonical control edge to
warm orange `#a75800` on both Web and Companion. Resting controls now expose an
actual one-pixel boundary, hover changes both the boundary and background to
cyan with an inner underline, and pressed/selected feedback moves to emerald.
The rebuilt packages are:

- production: `4C61E0DE64D8D00299CED83D2D798AE9EAC90AC8F5EDE6D6C1510A9231AC6055`;
- development: `6E0B543BAF9EB0BDCB20ABF1CC4DDD6B9F0AF3A58741C40880579F37F4FA3D75`.

After the author requested that every formerly dark structural edge in Light
become orange, the Light `--line` token was aligned with the orange family.
Cards, fields, rails and separators now use orange; readable body text stays
dark, active selection stays emerald, hover stays cyan, danger stays red and
disabled actions retain a neutral grey edge.

The author then selected a soft blue Light family to answer the Dark navy
surface without recreating glare: `#dbe6ee` background, `#edf3f7` cards and
`#cbdbe7` secondary surfaces. Orange remains structural; emerald is reserved
for active/success meaning rather than tinting the entire interface.

The final balance uses deep blue-black `#293d4f` for structural separators and
warm orange `#a75800` for actionable controls. This mirrors the Dark surface
hierarchy more closely than the earlier green or all-orange separators. Web and
Companion now transition backgrounds, borders and text over 180 ms when the
theme changes; both reduced-motion modes cancel that transition.

The shared portal artwork remains visible behind the Light workbench at 20%
opacity, reduced to 16% under stronger contrast. Dark uses 24% normally and
18% under stronger contrast, preserving cross-theme identity without placing
art behind the opaque cards and forms.

## Automated gates

- Web: 13 test files passed, 93 tests passed.
- TypeScript and Vite production build passed.
- Companion low-glare Light contrast gate passed.
- Companion trusted-click open/close handshake passed.
- Companion snapshot lifecycle gate passed.
- Extension MV3 and restricted-host validation passed.
- Production and development ZIPs match runtime sources byte for byte in both
  public locations.
- `git diff --check` reported no whitespace error.

## Preserved boundary

No engine, tool, receipt-v3, consent, QPU or provider contract changed during
this pass. Existing author-owned Devpost state and video files were not edited.
