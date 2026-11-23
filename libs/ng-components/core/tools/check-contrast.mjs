// WCAG 2.x contrast gate for the ngc palettes, light and dark (review 2026-10-04 L-03/L-04/L-05).
// Parses the oklch() tokens of every _theme-*.scss – plain values and both
// halves of light-dark(<light>, <dark>) – and checks the pairs the
// components actually render: text on its surface (>= 4.5:1) and control
// boundaries / focus rings on the page (>= 3:1, WCAG 1.4.11). Reports every
// failing pair, then exits 1. Run: node libs/ng-components/core/tools/check-contrast.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const stylesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles');

/** [foreground token, background token, minimum ratio] */
const PAIRS = [
  ['foreground', 'background', 4.5],
  ['card-foreground', 'card', 4.5],
  ['popover-foreground', 'popover', 4.5],
  ['muted-foreground', 'background', 4.5],
  ['muted-foreground', 'card', 4.5],
  ['muted-foreground', 'popover', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['primary-foreground', 'primary-hover', 4.5],
  ['secondary-foreground', 'secondary', 4.5],
  ['accent-foreground', 'accent', 4.5],
  ['destructive-foreground', 'destructive', 4.5],
  ['destructive-foreground', 'destructive-hover', 4.5],
  // tokens used as text on the page: field errors / invalid labels, link buttons
  ['destructive', 'background', 4.5],
  ['destructive', 'card', 4.5],
  ['primary', 'background', 4.5],
  // non-text: control borders (checkbox/radio/input) and the solid focus outline
  ['input', 'background', 3],
  ['input', 'card', 3],
  ['ring', 'background', 3],
  ['ring', 'card', 3],
];

const TOKEN = /--([a-z-]+):\s*([^;]+);/g;
const OKLCH = /oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg(?:\s*\/\s*([\d.]+)%)?\)/g;
const SCHEMES = ['light', 'dark'];

/** Token maps per scheme: a light-dark() value splits, a plain oklch() value counts for both. */
function parsePalette(file) {
  const schemes = { light: new Map(), dark: new Map() };
  for (const [, name, value] of readFileSync(file, 'utf8').matchAll(TOKEN)) {
    const colors = [...value.matchAll(OKLCH)].map((match) => ({
      l: +match[1] / 100,
      c: +match[2],
      h: +match[3],
      alpha: match[4] ? +match[4] / 100 : 1,
    }));
    if (colors.length === 0) {
      continue;
    }
    const [light, dark] = value.trimStart().startsWith('light-dark(') ? colors : [colors[0], colors[0]];
    schemes.light.set(name, light);
    schemes.dark.set(name, dark);
  }
  return schemes;
}

function oklchToLinearSrgb({ l, c, h }) {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

const gamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Translucent foregrounds (the dark borders) are composited over the
 * background the way the browser does it – in gamma-encoded sRGB, not in
 * linear light – before the luminance is taken.
 */
function contrast(foreground, background) {
  const bg = oklchToLinearSrgb(background).map(gamma);
  const fg = oklchToLinearSrgb(foreground)
    .map(gamma)
    .map((v, i) => v * foreground.alpha + bg[i] * (1 - foreground.alpha));
  const [hi, lo] = [luminance(fg.map(linear)), luminance(bg.map(linear))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failures = 0;
for (const file of readdirSync(stylesDir)
  .filter((name) => /^_theme-.*\.scss$/.test(name))
  .sort()) {
  const palette = file.replace(/^_theme-|\.scss$/g, '');
  const schemes = parsePalette(join(stylesDir, file));
  for (const scheme of SCHEMES) {
    const tokens = schemes[scheme];
    for (const [fg, bg, min] of PAIRS) {
      const foreground = tokens.get(fg);
      const background = tokens.get(bg);
      if (!foreground || !background) {
        console.error(`${palette} ${scheme}: missing token --${foreground ? bg : fg}`);
        failures++;
        continue;
      }
      const ratio = contrast(foreground, background);
      if (ratio < min) {
        console.error(`${palette} ${scheme}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
        failures++;
      }
    }
  }
}

if (failures > 0) {
  process.exit(1);
}
console.log('check-contrast: all palette token pairs pass in light and dark');
