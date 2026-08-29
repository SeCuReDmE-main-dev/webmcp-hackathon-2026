# Seasonal contrast receipt — 2026-08-29

Status: PASS

Method: WCAG 2.x relative-luminance contrast calculation against the exact CSS
tokens in `prototype/webmcp-qcg/src/styles.css`. Ratios are rounded to two
decimals. The normal-text gate is 4.5:1.

| Theme | Text / page | Text / surface | Muted / page | Muted / surface | Accent / page | Primary ink / accent |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Autumn | 16.53 | 13.87 | 11.14 | 9.34 | 8.35 | 8.46 |
| Winter | 16.04 | 12.91 | 11.32 | 9.11 | 10.72 | 11.49 |
| Spring | 15.25 | 11.75 | 11.56 | 8.91 | 9.40 | 10.72 |
| Summer | 14.59 | 11.07 | 10.09 | 7.65 | 10.27 | 12.23 |

The minimum measured ratio is **7.65:1** for Summer muted text on the raised
surface. Every tested foreground/background pair therefore exceeds the 4.5:1
normal-text requirement. Text, icons and accessible labels remain present in
addition to colour for functional states.

This receipt validates the current token set. Jean-Sébastien retains the final
graphic direction; future illustration changes must preserve these foreground
and background gates.
