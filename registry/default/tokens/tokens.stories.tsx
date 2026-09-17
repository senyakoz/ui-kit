import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

const surfaces = [
  {
    token: "background",
    label: "background / foreground",
    className: "bg-background text-foreground",
  },
  { token: "card", label: "card / card-foreground", className: "bg-card text-card-foreground" },
  {
    token: "popover",
    label: "popover / popover-foreground",
    className: "bg-popover text-popover-foreground",
  },
  {
    token: "primary",
    label: "primary / primary-foreground",
    className: "bg-primary text-primary-foreground",
  },
  {
    token: "secondary",
    label: "secondary / secondary-foreground",
    className: "bg-secondary text-secondary-foreground",
  },
  {
    token: "muted",
    label: "muted / muted-foreground",
    className: "bg-muted text-muted-foreground",
  },
  {
    token: "accent",
    label: "accent / accent-foreground",
    className: "bg-accent text-accent-foreground",
  },
  {
    token: "destructive",
    label: "destructive / destructive-foreground",
    className: "bg-destructive text-destructive-foreground",
  },
  {
    token: "success",
    label: "success / success-foreground",
    className: "bg-success text-success-foreground",
  },
  {
    token: "warning",
    label: "warning / warning-foreground",
    className: "bg-warning text-warning-foreground",
  },
  { token: "info", label: "info / info-foreground", className: "bg-info text-info-foreground" },
];

const lines = [
  { token: "border", className: "bg-border" },
  { token: "input", className: "bg-input" },
  { token: "ring", className: "bg-ring" },
];

function Swatches({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid gap-3 bg-background p-6 text-foreground">
      {surfaces.map(({ token, label, className }) => (
        <div
          key={token}
          data-token={`${theme}-${token}`}
          className={`rounded-md border p-4 text-sm ${className}`}
        >
          {label}
        </div>
      ))}
      <div className="flex gap-3">
        {lines.map(({ token, className }) => (
          <div key={token} className="flex flex-1 flex-col gap-2 text-xs text-muted-foreground">
            {token}
            <div data-token={`${theme}-${token}`} className={`h-6 rounded-md ${className}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
        gradient-primary
        <div className="h-10 rounded-md bg-primary bg-gradient-primary" />
      </div>
    </div>
  );
}

const meta = {
  title: "Реестр/Дизайн-токены",
  component: Swatches,
  parameters: {
    docs: {
      description: {
        component:
          "Семантические токены из tokens.css, включая статусные success/warning/info. Компоненты используют только их, без захардкоженных цветов. Тема переключается классом dark, тумблер находится в панели инструментов Storybook. Шкалы и таблица контраста — на странице «Реестр/Шкалы и токены».",
      },
    },
  },
} satisfies Meta<typeof Swatches>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { theme: "light" },
};

export const Dark: Story = {
  args: { theme: "dark" },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

export const BothThemes: Story = {
  args: { theme: "light" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Swatches theme="light" />
      <div className="dark">
        <Swatches theme="dark" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const read = (name: string) => {
      const element = canvasElement.querySelector<HTMLElement>(`[data-token="${name}"]`);
      if (!element) throw new Error(`Нет элемента с токеном ${name}`);
      return getComputedStyle(element).backgroundColor;
    };

    for (const { token } of [...surfaces, ...lines]) {
      const light = read(`light-${token}`);
      const dark = read(`dark-${token}`);
      await expect(light).not.toBe("rgba(0, 0, 0, 0)");
      await expect(dark).not.toBe("rgba(0, 0, 0, 0)");
      await expect(dark).not.toBe(light);
    }
  },
};
