import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/registry/default/ui/button";
import { ErrorState } from "./error-state";

const meta = {
  component: ErrorState,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Состояние ошибки: заголовок, необязательное описание и действие для повторной попытки.",
      },
    },
  },
  argTypes: {
    action: {
      control: "boolean",
      mapping: {
        true: <Button variant="outline">Повторить</Button>,
        false: undefined,
      },
    },
  },
  args: {
    title: "Не удалось загрузить данные",
    description: "Проверьте соединение и попробуйте ещё раз.",
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  render: (args) => (
    <ErrorState
      {...args}
      action={
        <Button variant="outline" onClick={() => {}}>
          Повторить
        </Button>
      }
    />
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "Что-то пошло не так",
    description: undefined,
  },
};
