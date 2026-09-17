import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImagePreview } from "./image-preview";

const meta = {
  component: ImagePreview,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Превью изображения с фиксированными пропорциями и заглушкой, если картинки нет.",
      },
    },
  },
  argTypes: {
    aspect: {
      description: "Пропорции контейнера: вертикальные, квадрат или горизонтальные",
      control: "select",
      options: ["portrait", "square", "landscape"],
    },
  },
  args: {
    url: "https://int.prometey.app/uploads/wf_791800d1c4.svg",
    alt: "Приседания со штангой",
  },
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portrait: Story = {};

export const Square: Story = {
  args: { aspect: "square" },
};

export const Landscape: Story = {
  args: { aspect: "landscape" },
};

export const Fallback: Story = {
  args: { url: undefined },
};
