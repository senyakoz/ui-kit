import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  component: Avatar,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Аватар пользователя: круглый контейнер с изображением и запасным содержимым. Собирается из Avatar, AvatarImage и AvatarFallback, фолбэк показывается пока картинка грузится или если её нет.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://int.prometey.app/uploads/wf_791800d1c4.svg" alt="User" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>KZ</AvatarFallback>
    </Avatar>
  ),
};
