import fs from 'fs';

const css = fs.readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function parseSection(selector) {
  const regex = new RegExp(`${selector}\\s*{([\\s\\S]*?)}`, 'm');
  const match = css.match(regex);
  if (!match) return {};
  const vars = {};
  const varRegex = /--([\w-]+):\s*([^;]+);/g;
  let m;
  while ((m = varRegex.exec(match[1]))) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}

function parseHsl(str) {
  const [h, s, l] = str.split(/\s+/).map(v => parseFloat(v));
  return hslToRgb(h, s, l);
}

function luminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(c1, c2) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const brightest = Math.max(l1, l2) + 0.05;
  const darkest = Math.min(l1, l2) + 0.05;
  return brightest / darkest;
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function parseColor(str) {
  return str.startsWith('#') ? hexToRgb(str) : parseHsl(str);
}

function getColor(value, vars) {
  if (value.startsWith('var(')) {
    const key = value.match(/--([\w-]+)/)[1];
    return getColor(vars[key], vars);
  }
  return parseColor(value);
}

const light = parseSection(':root');
const dark = parseSection('.dark');

const pairs = [
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['destructive', 'destructive-foreground'],
  ['accent', 'accent-foreground'],
  ['success', 'success-foreground'],
  ['warning', 'warning-foreground'],
  ['card', 'card-foreground'],
  ['muted', 'muted-foreground'],
  ['sidebar', 'sidebar-foreground'],
  ['sidebar-primary', 'sidebar-primary-foreground'],
  ['sidebar-accent', 'sidebar-accent-foreground'],
];

function run(theme, vars) {
  console.log(`\n${theme} mode`);
  pairs.forEach(([bg, fg]) => {
    const c = contrast(getColor(vars[bg], vars), getColor(vars[fg], vars));
    const ratio = c.toFixed(2);
    const warn = c < 4.5 ? ' ❗' : '';
    console.log(`${bg} on ${fg}: ${ratio}${warn}`);
  });
}

run('Light', light);
run('Dark', dark);
