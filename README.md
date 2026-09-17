# prometey-ui

UI-кит проекта Prometey: компоненты на shadcn/ui (Radix + Tailwind CSS v4), дизайн-токены, утилита `cn`,
Storybook и тесты. Единственный источник истины для UI — этот репозиторий; приложение подключает его
как git submodule и не хранит копий компонентов.

## Два канала потребления

| Канал | Кто потребитель | Что получает |
| --- | --- | --- |
| git submodule `ui-kit/` | приложение Prometey | исходники как есть; токены уровней 1–3 импортом `tokens.css`, уровень 4 приложение объявляет само |
| shadcn registry | любой проект на Tailwind v4 | файлы компонента, `cn` файлом `lib/utils.ts`, токены файлом `tokens.css`, уровень 4 — мержем в CSS проекта |

```bash
npx shadcn@latest add senyakoz/ui-kit/button
npx shadcn@latest list senyakoz/ui-kit
npx shadcn@latest view senyakoz/ui-kit/navbar
```

`registry.json` лежит в корне репозитория, поэтому сервер и сборка не нужны: shadcn CLI читает манифест
и файлы прямо из GitHub. Для воспроизводимости адрес можно пинать тегом или SHA:
`npx shadcn@latest add senyakoz/ui-kit/button#v1.0.0`.

Потребителю нужен **Tailwind CSS v4**. Item `theme` кладёт `tokens.css` (уровни 1–3) файлом рядом с
CSS проекта, добавляет туда `@import "./tokens.css"` и вливает уровень 4 — `@theme inline`, `@utility`
и `@layer base`. На Tailwind v3 CLI свалится в fallback `@layer base { .theme { … } }` и утилит не создаст.
Компоненты `sheet` и `dropdown-menu` дополнительно требуют `@import "tw-animate-css"` в CSS проекта.

Токены приезжают **обычным исходным файлом**, как `cn`: с комментариями, разбивкой по уровням и
правом потребителя их менять. Повторный `add` не затирает правки — CLI спрашивает подтверждение.
Уровни 1–3 намеренно не отдаются через `cssVars`: CLI проецирует каждый ключ `cssVars.light`
в `@theme inline`, и вся палитра превратилась бы у потребителя в утилиты `bg-palette-*` — ровно то,
что кит запрещает в своих же компонентах.

Целевой путь `src/app/tokens.css` рассчитан на дефолтную раскладку shadcn. Если CSS-файл проекта лежит
иначе, потребитель переносит `tokens.css` рядом с ним и правит `@import` — об этом говорит `docs` item'а,
который CLI печатает после установки.

## Структура

```
registry.json                    # манифест по официальной схеме shadcn (генерируется)
components.json                  # конфиг shadcn CLI для самого кита
lib/
  utils.ts                       # cn: clsx + extendTailwindMerge
registry/
  build.ts                       # сборка манифеста из исходников
  registry.meta.ts               # заголовки, описания и категории items
  theme-item.ts                  # сборка item theme из tokens.css и styles/globals.css
  registry.test.ts               # валидация манифеста по официальной схеме
  schema/                        # локальные копии официальных схем shadcn
  default/
    ui/<name>/                   # компонент: <name>.tsx, index.ts, <name>.stories.tsx
    tokens/tokens.css            # дизайн-токены, уровни 1–3
    tokens/tokens.contrast.ts    # расчёт контраста пар по WCAG
    styles/globals.css           # CSS для Storybook и тестов кита: tokens.css + уровень 4
.storybook/                      # конфигурация Storybook
scripts/sync-registry.ts         # перегенерация registry.json
```

## Уровни токенов

1. **Палитра** `--palette-*` — единственное место с литеральными цветами (OKLCH).
2. **Роли темы** `--surface`, `--brand`, `--line`, `--success`… — только здесь расходятся `:root` и `.dark`.
3. **Семантика shadcn** `--primary`, `--muted`, `--input`, `--*-foreground`, `--gradient-primary`, `--radius`, `--z-*`.
4. **Проекция в утилиты Tailwind** — `@theme inline` для `--color-*`/`--radius-*`, `@theme` для типографики
   `--text-*`, `@utility` для `bg-gradient-*`.

Уровни 1–3 живут в `registry/default/tokens/tokens.css` и уезжают потребителю как есть. Уровень 4
объявляет проект: в ките — `registry/default/styles/globals.css` (для Storybook), в приложении Prometey —
`src/app/globals.css`, во внешнем проекте — item `theme`, который CLI вливает в его CSS.

## Стандарт компонента

- Вариантность через `class-variance-authority`, `React.forwardRef` для примитивов, `displayName`,
  экспорт `XxxProps` и `xxxVariants`.
- Только семантические классы (`bg-primary`, `text-muted-foreground`, `rounded-lg`, `text-body-md`):
  без hex/rgb/oklch, классов палитры Tailwind и произвольных значений цвета, радиуса и размера текста.
- Внутренние импорты — только каноническими алиасами `@/lib/utils` и `@/registry/default/ui/<name>`:
  именно их shadcn CLI переписывает под структуру проекта-получателя. Относительные пути между
  компонентами ломают этот канал.
- Маршруты, состояние авторизации и бизнес-логика в кит не попадают: они приходят пропсами
  (`items`, `isAuthenticated`, `onLogout`). А вот бренд — имя «Prometey» в `footer` и `navbar-brand`
  и логотип-гантель — зашит намеренно: это кит Prometey, а не нейтральная библиотека. Внешний
  потребитель получает компоненты исходником и меняет бренд прямо в установленных файлах, как
  и любой другой код из shadcn-реестра.

## Добавить компонент

1. Создать `registry/default/ui/<name>/` с `<name>.tsx`, `index.ts` и `<name>.stories.tsx`.
2. Экспортировать компонент и типы из `registry/default/ui/index.ts`.
3. Описать item в `registry/registry.meta.ts` (title, description, category, type).
4. `npm run registry:sync` — файлы, npm-зависимости и registry-зависимости выведутся из импортов.
5. `npm run test` и `npm run lint`.

## Команды

```bash
npm run storybook          # Storybook на 6006
npm run build-storybook    # статический билд Storybook
npm run test               # Vitest: юнит-тесты + истории в headless Chromium
npm run typecheck          # tsc --noEmit
npm run lint               # biome check
npm run registry:sync      # перегенерировать registry.json из исходников
npm run registry:build     # собрать статический payload в public/r
npm run registry:validate  # shadcn registry validate senyakoz/ui-kit
```

Перед первым запуском тестов нужен браузер для Storybook-раннера: `npx playwright install chromium`.

## Проверка темы перед публикацией

После любой правки токенов item `theme` проверяется установкой в одноразовый проект на Tailwind v4:

```bash
npm run registry:build
(cd public && python3 -m http.server 8899 &)
# в пустом проекте с components.json и @import "tailwindcss":
npx shadcn@latest add http://localhost:8899/r/theme.json --yes
npx @tailwindcss/cli -i src/app/globals.css -o out.css
```

У потребителя должны появиться файл `tokens.css` (байт в байт с исходником кита, с `:root` и `.dark`)
и в `globals.css` — `@import "./tokens.css"`, `@theme inline`, `@custom-variant dark`,
`@utility bg-gradient-primary`; в `out.css` — `.bg-primary`, `.bg-gradient-primary`, `.text-body-md`.
Блок `@layer base { .theme { … } }` означает, что потребитель на Tailwind v3 — это провал проверки.
Артефакт `var(----` означает, что в `cssVars` попали ключи с ведущими `--`.
Появление `--color-palette-*` означает, что уровни 1–3 снова утекли в `cssVars`.

## Версионирование

Версия кита фиксируется тегом. Приложение пинует конкретный коммит через gitlink submodule,
поэтому обновление кита всегда отдельный осознанный коммит на стороне приложения.
