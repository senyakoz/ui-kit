import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  component: Badge,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Небольшая метка статуса. Базовые варианты и статусные success/warning/info на токенах темы, размер наследуется от типографики родителя.",
      },
    },
  },
  argTypes: {
    variant: {
      description: "Оформление метки под смысл статуса",
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "success", "warning", "info"],
    },
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Success: Story = {
  args: { variant: "success" },
};

export const Warning: Story = {
  args: { variant: "warning" },
};

export const Info: Story = {
  args: { variant: "info" },
};
