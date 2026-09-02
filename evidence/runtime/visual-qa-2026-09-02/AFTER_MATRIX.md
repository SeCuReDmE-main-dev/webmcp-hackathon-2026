# Actions 204–212 — final responsive and accessibility matrix

Captured: 2026-09-02 04:43 EDT (America/Toronto)

Runtime: Chrome `152.0.7977.66`; local candidate served from `http://127.0.0.1:5173/`; public trusted-click proof executed at `https://qcg.securedme.ca/`.

## Captures

| File | Surface and gate | SHA-256 |
|---|---|---|
| `after/web-dark-320x900.png` | Phone-width Web surface; one horizontal console navigation; `Companion · desktop` replaces the unavailable extension action | `1EEC71C234A3FC460EB467C585BA333ECC01B43306DA7A4EE0804C973C94A16A` |
| `after/web-dark-768x900.png` | Tablet-width Web surface; single-column workbench without clipped cards | `39B0E458262E6422161A64E48F159527852E20CF4518BDE6DCF064F3056EA983` |
| `after/web-dark-1440x900.png` | Desktop Web surface; rail, workbench, splitter and inspector visible together | `17960D4E46EA0671CCE75815FB619D76393EE18880C62D30950749DD5FE95E29` |
| `after/web-dark-compact-access.png` | Compact Web Access dialog and central Activity layout | `2BE9855BD3A7BBB84470C947AD6E0E453A19D737240F23778C4A9947ED7E873A` |
| `after/companion-light-access.png` | Narrow desktop Companion Light theme and Access controls | `40ADC14C00BDC94D8D3AEDC2F4B24C0A63619C4F3E502EFB1DAAB5FBC53AA1CF` |

## Browser interaction matrix

| Gate | Result |
|---|---|
| Compact navigation | At 320 px the accessibility tree exposed exactly one `QCG console views` navigation. Opening the rail replaced, rather than duplicated, the compact navigation. |
| Mobile Companion boundary | At 320 px the trusted extension button was absent and one non-interactive `Companion availability` note was present. The desktop button returned at 1440 px. |
| Access controls | Base, Autism Calm, ADHD Sprint and Deep Work were exposed. Deep Work, 125%, stronger contrast, reduced motion and underlined controls all changed the root presentation state. |
| Persistence and reset | The selected Access state survived a real page reload. `Reset preferences` restored Base, 100%, standard contrast, motion enabled and no underline. |
| Trusted Companion action | A real Chrome trusted click on the public page returned `Companion side panel opened`. The author's current unpacked-source check confirmed one-click open and one-click close. |
| Navigation beside Companion | With the side panel open, the public Web rail changed the center workspace from Inspector to Activity. |
| Keyboard and focus | The console was traversed with Tab/Escape; focus rules use a two-pixel outline plus offset and the Access dialog closes with Escape. The compact rail also closes with Escape. |
| Motion | `Reduce motion` removes animations, transitions and smooth scrolling; Deep Work and Autism Calm also request the reduced-motion presentation. |
| Light contrast | The Companion low-glare test passes its luminance and contrast gates; the author approved the sage Light surface and orange attention boundaries. |

## Boundary

The Companion is a Chrome/Edge desktop extension surface. The Web application remains fully usable on a phone without it. Phone-width UI therefore communicates availability instead of presenting a control that cannot succeed.
