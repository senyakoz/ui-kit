export type Theme = "light" | "dark";

export type Rgb = readonly [number, number, number];

export interface ContrastPair {
  foreground: string;
  background: string;
  kind: "text" | "ui";
}

export const AA_MIN = { text: 4.5, ui: 3 } as const;

export const designExceptions: readonly string[] = [
  "light:primary-foreground/primary",
  "light:muted-foreground/muted",
  "light:destructive-foreground/destructive",
  "light:input/background",
  "dark:primary-foreground/primary",
  "dark:input/background",
];

export const contrastPairs: readonly ContrastPair[] = [
  { foreground: "foreground", background: "background", kind: "text" },
  { foreground: "card-foreground", background: "card", kind: "text" },
  { foreground: "popover-foreground", background: "popover", kind: "text" },
  { foreground: "primary-foreground", background: "primary", kind: "text" },
  { foreground: "secondary-foreground", background: "secondary", kind: "text" },
  { foreground: "muted-foreground", background: "muted", kind: "text" },
  { foreground: "muted-foreground", background: "background", kind: "text" },
  { foreground: "accent-foreground", background: "accent", kind: "text" },
  { foreground: "destructive-foreground", background: "destructive", kind: "text" },
  { foreground: "success-foreground", background: "success", kind: "text" },
  { foreground: "warning-foreground", background: "warning", kind: "text" },
  { foreground: "info-foreground", background: "info", kind: "text" },
  { foreground: "input", background: "background", kind: "ui" },
  { foreground: "ring", background: "background", kind: "ui" },
];

const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
const declarationPattern = /(--[\w-]+)\s*:\s*([^;]+);/g;

function collectVariables(css: string, theme: Theme) {
  const variables = new Map<string, string>();
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectorOrder: string[] = theme === "light" ? [":root"] : [":root", ".dark"];

  for (const target of selectorOrder) {
    for (const [, selector, body] of withoutComments.matchAll(blockPattern)) {
      const selectors = (selector.split(";").pop() ?? "").split(",").map((part) => part.trim());
      if (!selectors.includes(target)) continue;
      for (const [, name, value] of body.matchAll(declarationPattern)) {
        variables.set(name, value.trim());
      }
    }
  }

  return variables;
}

function resolve(variables: Map<string, string>, name: string, depth = 0): string {
  const value = variables.get(name);
  if (value === undefined) throw new Error(`Токен ${name} не объявлен`);
  if (depth > 20) throw new Error(`Циклическая ссылка в токене ${name}`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? resolve(variables, reference[1], depth + 1) : value;
}

export function readToken(css: string, theme: Theme, token: string) {
  return resolve(collectVariables(css, theme), `--${token}`);
}

function linearToSrgb(channel: number) {
  const clamped = Math.min(1, Math.max(0, channel));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

export function parseColor(value: string): Rgb {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const digits =
      hex[1].length === 3
        ? hex[1]
            .split("")
            .map((digit) => digit + digit)
            .join("")
        : hex[1];
    return [0, 2, 4].map((offset) => parseInt(digits.slice(offset, offset + 2), 16) / 255) as [
      number,
      number,
      number,
    ];
  }

  const oklch = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (oklch) {
    const lightness = Number(oklch[1]) / (oklch[2] ? 100 : 1);
    const chroma = Number(oklch[3]);
    const hue = (Number(oklch[4]) * Math.PI) / 180;
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
  }

  throw new Error(`Неподдерживаемый формат цвета: ${value}`);
}

function relativeLuminance([r, g, b]: Rgb) {
  const linear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrastRatio(foreground: Rgb, background: Rgb) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function measureContrast(css: string, theme: Theme) {
  return contrastPairs.map((pair) => {
    const ratio = contrastRatio(
      parseColor(readToken(css, theme, pair.foreground)),
      parseColor(readToken(css, theme, pair.background)),
    );
    const id = `${theme}:${pair.foreground}/${pair.background}`;
    return {
      ...pair,
      id,
      theme,
      ratio,
      passes: ratio >= AA_MIN[pair.kind],
      designException: designExceptions.includes(id),
    };
  });
}
