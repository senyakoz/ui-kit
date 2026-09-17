import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Navbar } from "./navbar";
import type { NavItem } from "./navbar.types";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Дашборд" },
  { href: "/exercises", label: "Упражнения" },
  { href: "/workouts", label: "Тренировки" },
];

const meta = {
  component: Navbar,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Шапка приложения. Компонент презентационный: состояние авторизации, пункты меню и обработчик выхода приходят пропсами.",
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    items: navItems,
    pathname: "/exercises",
    brandHref: "/",
    isAuthenticated: false,
    isLoading: false,
    onLogout: fn(),
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const authenticated = {
  brandHref: "/dashboard",
  isAuthenticated: true,
  userName: "kozich",
  userEmail: "kozich@cyrvony.club",
};

export const Unauthorized: Story = {};

export const Loading: Story = {
  args: { ...authenticated, isLoading: true },
};

export const Authenticated: Story = {
  args: authenticated,
};

export const AuthenticatedLogout: Story = {
  args: authenticated,
  play: async ({ args, canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /kozich/i });
    await userEvent.click(trigger);
    const logoutItem = await within(document.body).findByRole("menuitem", { name: /выйти/i });
    await userEvent.click(logoutItem);
    await expect(args.onLogout).toHaveBeenCalledTimes(1);
  },
};

export const Mobile: Story = {
  args: authenticated,
  parameters: {
    nextjs: { appDirectory: true },
    viewport: { defaultViewport: "mobile1" },
  },
};
