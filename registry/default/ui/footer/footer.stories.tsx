import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./footer";

const meta = {
  component: Footer,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component: "Подвал приложения с копирайтом.",
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
