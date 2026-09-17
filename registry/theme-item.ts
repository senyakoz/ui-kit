import { readFileSync } from "node:fs";
import { join } from "node:path";

export type CssRules = Record<string, Record<string, Record<string, string>>>;

export const TOKENS_CSS = "registry/default/tokens/tokens.css";
const STYLES_CSS = "registry/default/styles/globals.css";

/**
 * Куда item theme кладёт tokens.css у потребителя и как этот файл потом импортируется.
 * Путь рассчитан на дефолтную раскладку shadcn (`src/app/globals.css`); если CSS-файл
 * проекта лежит иначе, потребитель переносит tokens.css рядом с ним и правит @import.
 */
export const TOKENS_TARGET = "~/src/app/tokens.css";
export const TOKENS_IMPORT = '@import "./tokens.css"';

/**
 * Токены уровня 4, которые не уезжают в реестр: шрифт подключает сам потребитель,
 * переменной --font-inter в его проекте нет.
 */
const THEME_EXCLUDED = new Set(["font-sans"]);

const blockPattern = /([^{}]*)\{((?:[^{}]|\{[^{}]*\})*)\}/g;
const declarationPattern = /(--[\w-]+)\s*:\s*([^;]+);/g;

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function declarations(body: string) {
  return [...body.matchAll(declarationPattern)].map(
    ([, name, value]) =>
      [
        name.slice(2),
        value.trim().replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")"),
      ] as const,
  );
}

/**
 * Уровень 4 из styles/globals.css: содержимое @theme inline и @theme уезжает в cssVars.theme,
 * @utility и @layer base — в css. Уровни 1-3 в cssVars не попадают: они доставляются
 * файлом tokens.css, иначе shadcn CLI проецирует всю палитру в @theme inline и у потребителя
 * появляются утилиты bg-palette-*, чего кит как раз избегает.
 */
export function readThemeLevel(root: string) {
  const css = stripComments(readFileSync(join(root, STYLES_CSS), "utf-8"));
  const theme: Record<string, string> = {};
  const rules: CssRules = {};

  for (const [, prelude, body] of css.matchAll(blockPattern)) {
    const atRule = prelude.split(/[;}]/).pop()?.trim() ?? "";

    if (atRule === "@theme" || atRule === "@theme inline") {
      for (const [name, value] of declarations(body)) {
        if (!THEME_EXCLUDED.has(name)) theme[name] = value;
      }
      continue;
    }

    if (atRule.startsWith("@utility ")) {
      const properties: Record<string, string> = {};
      for (const [, property, value] of body.matchAll(/([a-z-]+)\s*:\s*([^;]+);/g)) {
        properties[property] = value.trim();
      }
      rules[atRule] = { "&": properties };
    }
  }

  rules["@layer base"] = {
    "*": { "border-color": "var(--border)" },
    body: { "background-color": "var(--background)", color: "var(--foreground)" },
  };

  rules[TOKENS_IMPORT] = {};

  return { theme, css: rules };
}

export function buildThemeItem(root: string) {
  const { theme, css } = readThemeLevel(root);
  return {
    files: [{ path: TOKENS_CSS, type: "registry:file", target: TOKENS_TARGET }],
    cssVars: { theme },
    css,
  };
}
