import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  component: Input,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component: "Однострочное поле ввода. Принимает все нативные пропсы input.",
      },
    },
  },
  args: {
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, value: "Disabled input" },
};

export const WithValue: Story = {
  args: { defaultValue: "Hello World" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "email@example.com" },
};
