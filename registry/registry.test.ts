import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv";
import draft07 from "ajv/dist/refs/json-schema-draft-07.json";

import { buildRegistry, componentNames, type RegistryItem } from "./build";
import { components, REGISTRY_ADDRESS, UI_ROOT } from "./registry.meta";
import registrySchema from "./schema/registry.schema.json";
import itemSchema from "./schema/registry-item.schema.json";
import { TOKENS_CSS, TOKENS_IMPORT, TOKENS_TARGET } from "./theme-item";

const root = process.cwd();
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf-8"));
const items: RegistryItem[] = registry.items;
const names = items.map((item) => item.name);

describe("registry.json", () => {
  it("валиден по официальной схеме shadcn", () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    // Схемы shadcn ссылаются на draft-07 по https, ajv регистрирует его по http.
    ajv.addMetaSchema({ ...draft07, $id: "https://json-schema.org/draft-07/schema#" });
    ajv.addSchema(itemSchema, "https://ui.shadcn.com/schema/registry-item.json");
    const validate = ajv.compile(registrySchema);
    const valid = validate(registry);
    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("совпадает с манифестом, собранным из исходников", () => {
    expect(registry).toEqual(JSON.parse(JSON.stringify(buildRegistry(root))));
  });

  it("описывает ровно те компоненты, что лежат в registry/default/ui", () => {
    const declared = items
      .filter((item) => item.type === "registry:ui" || item.type === "registry:block")
      .map((item) => item.name)
      .sort();
    expect(declared).toEqual(componentNames(root));
    expect(Object.keys(components).sort()).toEqual(componentNames(root));
  });

  it("не содержит повторяющихся имён", () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(items)("$name: имя в kebab-case, title и description не пустые", (item) => {
    expect(item.name).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
    expect(item.title?.trim()).toBeTruthy();
    expect(item.description?.trim()).toBeTruthy();
  });

  it.each(items)("$name: все файлы манифеста существуют", (item) => {
    for (const file of item.files ?? []) {
      expect(existsSync(join(root, file.path)), file.path).toBe(true);
    }
  });

  it.each(items)("$name: registry-зависимости адресуются полным путём и существуют", (item) => {
    const dependencies = item.registryDependencies ?? [];
    expect(new Set(dependencies).size).toBe(dependencies.length);
    for (const dependency of dependencies) {
      expect(dependency.startsWith(`${REGISTRY_ADDRESS}/`), dependency).toBe(true);
      const dependencyName = dependency.slice(REGISTRY_ADDRESS.length + 1);
      expect(dependencyName).not.toBe(item.name);
      expect(names).toContain(dependencyName);
    }
  });

  it.each(componentNames(process.cwd()))("%s: файлы компонента на месте", (name) => {
    const files = readdirSync(join(root, UI_ROOT, name));
    expect(files).toContain("index.ts");
    expect(files).toContain(`${name}.tsx`);
    expect(files).toContain(`${name}.stories.tsx`);
  });

  it("stories, тесты и документация не уезжают потребителю", () => {
    const paths = items.flatMap((item) => (item.files ?? []).map((file) => file.path));
    expect(paths.filter((path) => /\.(stories|test)\.tsx?$|\.mdx$/.test(path))).toEqual([]);
  });

  it("не содержит циклов в registry-зависимостях", () => {
    const graph = new Map(
      items.map((item) => [
        item.name,
        (item.registryDependencies ?? []).map((dependency) =>
          dependency.slice(REGISTRY_ADDRESS.length + 1),
        ),
      ]),
    );
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[] = [];

    const walk = (name: string, path: string[]) => {
      if (visiting.has(name)) {
        cycles.push([...path, name].join(" -> "));
        return;
      }
      if (visited.has(name)) return;
      visiting.add(name);
      for (const next of graph.get(name) ?? []) walk(next, [...path, name]);
      visiting.delete(name);
      visited.add(name);
    };

    for (const name of names) walk(name, []);
    expect(cycles).toEqual([]);
  });
});

describe("theme item", () => {
  const theme = items.find((item) => item.name === "theme");
  const cssVars = theme?.cssVars as { theme: Record<string, string> };
  const css = theme?.css as Record<string, unknown>;

  it("ключи cssVars объявлены без ведущих --", () => {
    expect(Object.keys(cssVars.theme).filter((key) => key.startsWith("-"))).toEqual([]);
  });

  it("уровни 1-3 доставляются файлом tokens.css, а не через cssVars", () => {
    expect(Object.keys(cssVars)).toEqual(["theme"]);
    expect(theme?.files).toEqual([
      { path: TOKENS_CSS, type: "registry:file", target: TOKENS_TARGET },
    ]);
    expect(css).toHaveProperty(TOKENS_IMPORT);
  });

  it("палитра не протекает в cssVars: иначе CLI создаст у потребителя утилиты bg-palette-*", () => {
    expect(Object.keys(cssVars.theme).filter((key) => key.includes("palette"))).toEqual([]);
  });

  it("cssVars.theme покрывает весь уровень 4 из styles/globals.css", () => {
    const level4 = readFileSync(join(root, "registry/default/styles/globals.css"), "utf-8");
    const declared = [...level4.matchAll(/@theme[^{]*\{([^}]*)\}/g)].flatMap(([, body]) =>
      [...body.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name.slice(2)),
    );
    // --font-sans намеренно исключён: он ссылается на --font-inter, которого у потребителя нет
    for (const token of declared.filter((name) => name !== "font-sans")) {
      expect(Object.keys(cssVars.theme), token).toContain(token);
    }
  });

  it("не поставляет собственный @custom-variant dark: его добавляет shadcn CLI", () => {
    expect(JSON.stringify(theme?.css)).not.toContain("@custom-variant");
  });

  it("тела at-rule в css заданы объектом, а не строкой", () => {
    for (const [rule, body] of Object.entries(css)) {
      expect(typeof body, rule).toBe("object");
    }
  });
});
