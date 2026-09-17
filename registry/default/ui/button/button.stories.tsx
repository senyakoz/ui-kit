import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Button } from "./button";

const meta = {
  component: Button,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Основная кнопка набора: шесть вариантов оформления, пять размеров, форма default или pill и встроенное состояние загрузки. Проп asChild отдаёт стили дочернему элементу, например ссылке.",
      },
    },
  },
  argTypes: {
    variant: {
      description: "Оформление: акцентная, опасная, контурная, вторичная, призрачная или ссылка",
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      description:
        "Размер: отступы и высота. icon и icon-sm рассчитаны на кнопку без текста, icon-sm совпадает по высоте с sm",
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm"],
    },
    disabled: { description: "Блокирует кнопку", control: "boolean" },
    loading: {
      description: "Спиннер слева от содержимого, кнопка заблокирована",
      control: "boolean",
    },
    asChild: { control: false },
    shape: {
      description: "Форма: обычное скругление или пилюля для шапки",
      control: "select",
      options: ["default", "pill"],
    },
  },
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Icon: Story = {
  args: { size: "icon", children: "✦" },
};

export const IconSmall: Story = {
  args: { size: "icon-sm", shape: "pill", children: "✦" },
};

export const Pill: Story = {
  args: { size: "sm", shape: "pill", children: "Начать бесплатно" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true, children: "Загрузка" },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="/">Ссылка</a>,
  },
};

export const LoadingAsChild: Story = {
  args: {
    asChild: true,
    loading: true,
    children: <a href="/">Загрузка</a>,
  },
};

export const AsChildWithoutElement: Story = {
  args: { asChild: true, children: "Текст вместо элемента" },
};

export const CssCheck: Story = {
  args: { children: "CssCheck" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /csscheck/i });
    const bgColor = getComputedStyle(button).backgroundColor;
    await expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};
