import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  component: ThemeToggle,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Презентационный переключатель темы. Состояние и переключение приходят пропсами `isDark`/`onToggleTheme`, поэтому компонент не зависит от провайдера темы. Пока `pending`, показывает заглушку того же размера.",
      },
    },
  },
  args: {
    isDark: false,
    onToggleTheme: fn(),
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
  args: { isDark: true },
};

export const Pending: Story = {
  args: { pending: true },
};

export const CallsOnToggleTheme: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Включить тёмную тему" }));
    await expect(args.onToggleTheme).toHaveBeenCalledTimes(1);
  },
};

export const PreventedClickKeepsTheme: Story = {
  args: {
    onClick: fn((event) => event.preventDefault()),
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Включить тёмную тему" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(args.onToggleTheme).not.toHaveBeenCalled();
  },
};
