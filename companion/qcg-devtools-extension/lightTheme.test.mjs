import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('./panel.css', import.meta.url), 'utf8')
const lightBlock = css.match(/\.console\[data-theme="light"\]\s*\{([^}]+)\}/)?.[1]
assert(lightBlock, 'light-theme token block must exist')

const tokens = Object.fromEntries(
  [...lightBlock.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)]
    .map(([, name, value]) => [name, value.toLowerCase()])
)

for (const name of ['bg', 'surface', 'surface-2', 'line', 'fg', 'muted', 'emerald', 'cyan', 'gold', 'red']) {
  assert(tokens[name], `light theme requires --${name}`)
}

const luminance = (hex) => {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}
const contrast = (a, b) => {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (bright + 0.05) / (dark + 0.05)
}

assert(luminance(tokens.bg) <= 0.80, 'light background must remain below the low-glare luminance ceiling')
assert(luminance(tokens.surface) <= 0.90, 'light surfaces must avoid pure-white glare')
assert(tokens.surface !== '#ffffff', 'light theme must not use a pure-white primary surface')
assert(contrast(tokens.fg, tokens.bg) >= 7 && contrast(tokens.fg, tokens.surface) >= 7, 'foreground text requires enhanced contrast')
for (const name of ['muted', 'emerald', 'cyan', 'gold', 'red']) {
  assert(contrast(tokens[name], tokens.bg) >= 4.5, `${name} requires AA text contrast on the background`)
  assert(contrast(tokens[name], tokens.surface) >= 4.5, `${name} requires AA text contrast on surfaces`)
}
assert(contrast(tokens.line, tokens.bg) >= 3 && contrast(tokens.line, tokens.surface) >= 3, 'component boundaries require 3:1 contrast')

console.log('QCG Companion low-glare light theme passed luminance and contrast gates.')
