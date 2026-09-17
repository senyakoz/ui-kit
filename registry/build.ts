import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  components,
  REGISTRY_ADDRESS,
  REGISTRY_HOMEPAGE,
  REGISTRY_NAME,
  UI_ROOT,
} from "./registry.meta";
import { buildThemeItem, TOKENS_TARGET } from "./theme-item";

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  categories?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: unknown;
  css?: unknown;
  docs?: string;
}

const UI_ALIAS = "@/registry/default/ui/";
const UTILS_ALIAS = "@/lib/utils";

const isSourceFile = (file: string) =>
  (file.endsWith(".ts") || file.endsWith(".tsx")) &&
  !file.endsWith(".stories.tsx") &&
  !file.endsWith(".test.ts") &&
  !file.endsWith(".test.tsx");

export function componentNames(root: string) {
  return readdirSync(join(root, UI_ROOT), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function componentFiles(root: string, name: string) {
  return readdirSync(join(root, UI_ROOT, name))
    .filter(isSourceFile)
    .sort();
}

function readDependencies(root: string, name: string) {
  const npm = new Set<string>();
  const registryItems = new Set<string>();

  for (const file of componentFiles(root, name)) {
    const source = readFileSync(join(root, UI_ROOT, name, file), "utf-8");
    for (const [, specifier] of source.matchAll(/from "([^"]+)"/g)) {
      if (specifier.startsWith(UI_ALIAS)) {
        registryItems.add(specifier.slice(UI_ALIAS.length).split("/")[0]);
        continue;
      }
      if (specifier === UTILS_ALIAS) {
        registryItems.add("utils");
        continue;
      }
      if (specifier.startsWith("./") || specifier.startsWith("../") || specifier === "react") {
        continue;
      }
      if (specifier === "next" || specifier.startsWith("next/")) continue;
      npm.add(
        specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0],
      );
    }
  }

  return { npm: [...npm].sort(), registryItems: [...registryItems].sort() };
}

function componentItem(root: string, name: string): RegistryItem {
  const meta = components[name];
  if (!meta) throw new Error(`Компонент ${name} не описан в registry.meta.ts`);

  const { npm, registryItems } = readDependencies(root, name);
  const fileType = meta.type === "registry:block" ? "registry:component" : "registry:ui";

  return {
    name,
    type: meta.type,
    title: meta.title,
    description: meta.description,
    categories: [meta.category],
    ...(npm.length > 0 ? { dependencies: npm } : {}),
    ...(meta.devDependencies ? { devDependencies: meta.devDependencies } : {}),
    registryDependencies: ["theme", ...registryItems]
      .sort()
      .map((item) => `${REGISTRY_ADDRESS}/${item}`),
    files: componentFiles(root, name).map((file) => ({
      path: `${UI_ROOT}/${name}/${file}`,
      type: fileType,
      target: `@ui/${name}/${file}`,
    })),
  };
}

export function buildRegistry(root: string) {
  const theme = buildThemeItem(root);

  const items: RegistryItem[] = [
    {
      name: "utils",
      type: "registry:lib",
      title: "cn",
      description:
        "Утилита cn: clsx + tailwind-merge, расширенный классами типографики и градиентами кита",
      dependencies: ["clsx", "tailwind-merge"],
      files: [{ path: "lib/utils.ts", type: "registry:lib", target: "@lib/utils.ts" }],
    },
    {
      name: "theme",
      type: "registry:theme",
      title: "Дизайн-токены и тема",
      description:
        "Палитра, роли темы и семантика shadcn (уровни 1-3) файлом tokens.css плюс проекция в утилиты Tailwind: цвета, радиусы, типографика и градиент основной кнопки (уровень 4)",
      docs: `Тема рассчитана на Tailwind CSS v4. Токены приехали файлом ${TOKENS_TARGET.slice(2)} — правьте их как обычный исходник. Если CSS-файл проекта лежит не в src/app, перенесите tokens.css рядом с ним и поправьте импорт. Компоненты sheet и dropdown-menu дополнительно требуют @import "tw-animate-css".`,
      files: theme.files,
      cssVars: theme.cssVars,
      css: theme.css,
    },
    ...componentNames(root).map((name) => componentItem(root, name)),
  ];

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items,
  };
}
