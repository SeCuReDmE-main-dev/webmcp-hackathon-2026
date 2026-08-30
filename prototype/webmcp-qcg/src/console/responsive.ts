/** Matches the CSS one-pane breakpoint; kept pure for layout-contract tests. */
export const QCG_MOBILE_BREAKPOINT = 640
export function usesOnePaneConsole(width: number): boolean { return width <= QCG_MOBILE_BREAKPOINT }
