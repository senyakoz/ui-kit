import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/registry/default/ui/button";
import { EmptyState } from "./empty-state";

const meta = {
  component: EmptyState,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Заглушка для пустого списка: заголовок, необязательное описание и необязательное действие.",
      },
    },
  },
  argTypes: {
    action: {
      control: "boolean",
      mapping: {
        true: <Button variant="outline">Создать</Button>,
        false: undefined,
      },
    },
  },
  args: {
    title: "Пока пусто",
    description: "Здесь появятся ваши упражнения.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      action={
        <Button variant="outline" onClick={() => {}}>
          Создать
        </Button>
      }
    />
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "Ничего не найдено",
    description: undefined,
  },
};
