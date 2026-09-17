import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AA_MIN,
  contrastRatio,
  designExceptions,
  measureContrast,
  parseColor,
  readToken,
  type Theme,
} from "./tokens.contrast";

const css = readFileSync(join(process.cwd(), "registry/default/tokens/tokens.css"), "utf-8");
const themes: Theme[] = ["light", "dark"];

describe("tokens.contrast", () => {
  it("считает контраст по формуле WCAG", () => {
    expect(contrastRatio(parseColor("#000"), parseColor("#fff"))).toBeCloseTo(21, 5);
    expect(contrastRatio(parseColor("#fff"), parseColor("#fff"))).toBeCloseTo(1, 5);
    expect(contrastRatio(parseColor("#767676"), parseColor("#fff"))).toBeCloseTo(4.54, 2);
  });

  it("переводит oklch в sRGB", () => {
    const [r, g, b] = parseColor("oklch(1 0 0)");
    expect([r, g, b].map((channel) => Number(channel.toFixed(3)))).toEqual([1, 1, 1]);
  });

  it("разрешает цепочку ссылок до литерального цвета", () => {
    expect(readToken(css, "light", "primary")).toMatch(/^oklch\(/);
    expect(readToken(css, "dark", "background")).not.toBe(readToken(css, "light", "background"));
  });

  describe.each(themes)("тема %s", (theme) => {
    const pairs = measureContrast(css, theme);

    it.each(pairs.filter((pair) => !pair.designException))(
      "$foreground / $background проходит WCAG AA",
      ({ ratio, kind }) => {
        expect(ratio).toBeGreaterThanOrEqual(AA_MIN[kind]);
      },
    );

    it.each(pairs.filter((pair) => pair.designException))(
      "$foreground / $background — исключение по макету, пока не проходит AA",
      ({ passes }) => {
        expect(passes).toBe(false);
      },
    );
  });

  it("исключения по макету ссылаются на существующие пары", () => {
    const ids = themes.flatMap((theme) => measureContrast(css, theme).map((pair) => pair.id));
    for (const exception of designExceptions) {
      expect(ids).toContain(exception);
    }
  });
});
