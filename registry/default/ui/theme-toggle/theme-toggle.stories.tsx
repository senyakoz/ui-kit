import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { expect, fn, userEvent, waitFor } from "storybook/test";

import { ThemeToggle } from "./theme-toggle";

const storageKey = "storybook-theme-toggle";

const meta = {
  component: ThemeToggle,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Тумблер темы для приложения. Пока пользователь не нажимал, действует системная тема; нажатие переключает на противоположную видимой и запоминает выбор. Меняет класс dark на корне документа через next-themes, до монтирования показывает заглушку. Размер совпадает с кнопками sm в шапке.",
      },
    },
  },
  beforeEach: () => {
    localStorage.removeItem(storageKey);
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey={storageKey}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TogglesTheme: Story = {
  play: async ({ canvas }) => {
    const root = document.documentElement;
    await expect(localStorage.getItem(storageKey)).toBeNull();

    await userEvent.click(await canvas.findByRole("button", { name: "Включить тёмную тему" }));
    await waitFor(() => expect(root.classList.contains("dark")).toBe(true));
    await expect(localStorage.getItem(storageKey)).toBe("dark");

    await userEvent.click(await canvas.findByRole("button", { name: "Включить светлую тему" }));
    await waitFor(() => expect(root.classList.contains("dark")).toBe(false));
    await expect(localStorage.getItem(storageKey)).toBe("light");
  },
};

export const PreventedClickKeepsTheme: Story = {
  args: {
    onClick: fn((event) => event.preventDefault()),
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Включить тёмную тему" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(document.documentElement.classList.contains("dark")).toBe(false);
    await expect(localStorage.getItem(storageKey)).toBeNull();
  },
};
