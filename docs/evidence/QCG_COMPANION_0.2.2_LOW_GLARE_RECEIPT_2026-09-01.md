# QCG Companion 0.2.2 low-glare Light receipt

Date: 2026-09-01
Status: automated PASS; unpacked-extension reload and author visual review pending

## Trigger

After the repaired Companion opened successfully on the canonical QCG origin,
Jean-Sebastien reported that its original Light theme was visually excessive
and blurred focus. This is retained as direct author feedback, not generalized
as a clinical or population-level finding.

## Bounded correction

- Changed only Companion Light presentation tokens.
- Replaced the near-white background and pure-white primary surface with
  lower-luminance sage-mineral neutrals.
- Preserved deep text plus emerald, cyan, gold and red semantic accents.
- Preserved the DOM, A2A messages, bridge contracts, commands, permissions,
  authority boundary and Dark theme.
- Advanced the unpacked extension package from `0.2.1` to `0.2.2`.

## Automated proof

Command: `npm test` in `companion/qcg-devtools-extension`

- Manifest, restricted-host and strict-command validation: PASS.
- Trusted-click opening and synthetic-click rejection: PASS.
- Low-glare Light token test: PASS.

Measured token contrasts:

| Token | On background | On primary surface | Gate |
| --- | ---: | ---: | --- |
| foreground | 12.33:1 | 14.00:1 | 7:1 |
| muted | 5.76:1 | 6.54:1 | 4.5:1 |
| emerald | 5.05:1 | 5.74:1 | 4.5:1 |
| cyan | 4.88:1 | 5.55:1 | 4.5:1 |
| gold | 5.91:1 | 6.72:1 | 4.5:1 |
| red | 5.80:1 | 6.59:1 | 4.5:1 |
| component line | 3.14:1 | 3.57:1 | 3:1 |

The background and primary-surface relative luminance remain below their
bounded ceilings, and the primary surface contains no pure white.

## Remaining gate

Reload the unpacked extension once, reopen the QCG Companion, select Light and
obtain Jean-Sebastien's visual verdict. Automated contrast supports the change;
it does not replace the author's comfort assessment or broader accessibility
testing.
