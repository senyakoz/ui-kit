import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta = {
  component: Separator,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component: "Разделитель: горизонтальный или вертикальный, по умолчанию декоративный.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <p>Выше</p>
      <Separator />
      <p>Ниже</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center gap-4">
      <p>Слева</p>
      <Separator orientation="vertical" />
      <p>Справа</p>
    </div>
  ),
};
