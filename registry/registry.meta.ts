export const REGISTRY_NAME = "prometey-ui";
export const REGISTRY_OWNER = "senyakoz";
export const REGISTRY_REPO = "ui-kit";
export const REGISTRY_ADDRESS = `${REGISTRY_OWNER}/${REGISTRY_REPO}`;
export const REGISTRY_HOMEPAGE = `https://github.com/${REGISTRY_ADDRESS}`;

export const UI_ROOT = "registry/default/ui";
export const TOKENS_ROOT = "registry/default/tokens";

export type ItemType = "registry:ui" | "registry:block";

export interface ComponentMeta {
  title: string;
  description: string;
  category: string;
  type: ItemType;
  devDependencies?: string[];
}

/**
 * Человекочитаемая часть манифеста. Всё остальное (files, dependencies,
 * registryDependencies) выводится из исходников в registry/build.ts.
 */
export const components: Record<string, ComponentMeta> = {
  avatar: {
    title: "Avatar",
    description: "Аватар пользователя с изображением и фолбэком",
    category: "data-display",
    type: "registry:ui",
  },
  badge: {
    title: "Badge",
    description:
      "Бейдж с вариантами default/secondary/destructive/outline и статусными success/warning/info",
    category: "data-display",
    type: "registry:ui",
  },
  button: {
    title: "Button",
    description:
      "Кнопка с вариантами default/destructive/outline/secondary/ghost/link, размерами sm/default/lg/icon/icon-sm, формой default/pill и loading-состоянием; основной вариант с градиентом из макета",
    category: "actions",
    type: "registry:ui",
  },
  card: {
    title: "Card",
    description: "Карточка: Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter",
    category: "data-display",
    type: "registry:ui",
  },
  "dropdown-menu": {
    title: "Dropdown Menu",
    description: "Выпадающее меню на Radix DropdownMenu",
    category: "overlay",
    type: "registry:ui",
    devDependencies: ["tw-animate-css"],
  },
  "empty-state": {
    title: "Empty State",
    description: "Состояние пустого списка: иконка, заголовок, описание, действие",
    category: "feedback",
    type: "registry:ui",
  },
  "error-state": {
    title: "Error State",
    description: "Состояние ошибки: иконка, заголовок, описание, действие retry",
    category: "feedback",
    type: "registry:ui",
  },
  footer: {
    title: "Footer",
    description:
      "Подвал страницы с копирайтом. Название бренда зашито в компонент — правится в установленном файле",
    category: "layout",
    type: "registry:ui",
  },
  "image-preview": {
    title: "Image Preview",
    description:
      "Превью изображения с вариантами пропорции portrait/square/landscape и фолбэком-заглушкой",
    category: "media",
    type: "registry:ui",
  },
  input: {
    title: "Input",
    description: "Поле ввода",
    category: "forms",
    type: "registry:ui",
  },
  label: {
    title: "Label",
    description: "Подпись к полю формы на Radix Label",
    category: "forms",
    type: "registry:ui",
  },
  navbar: {
    title: "Navbar",
    description:
      "Навигационная панель приложения: бренд, ссылки разделов, переключатель темы, мобильное меню, меню пользователя. Состояние авторизации и пункты навигации приходят пропсами; название бренда и логотип зашиты в navbar-brand и правятся в установленном файле",
    category: "navigation",
    type: "registry:block",
  },
  separator: {
    title: "Separator",
    description: "Разделитель горизонтальный/вертикальный на Radix Separator",
    category: "layout",
    type: "registry:ui",
  },
  sheet: {
    title: "Sheet",
    description: "Боковая панель на Radix Dialog с вариантами стороны top/bottom/left/right",
    category: "overlay",
    type: "registry:ui",
    devDependencies: ["tw-animate-css"],
  },
  skeleton: {
    title: "Skeleton",
    description: "Скелетон-заглушка для состояний загрузки",
    category: "feedback",
    type: "registry:ui",
  },
  "theme-toggle": {
    title: "Theme Toggle",
    description:
      "Презентационный переключатель темы: состояние и переключение приходят пропсами isDark/onToggleTheme; пока тема неизвестна (pending), показывает заглушку",
    category: "actions",
    type: "registry:ui",
  },
};
