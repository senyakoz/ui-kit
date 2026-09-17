import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/registry/default/ui/input";
import { Label } from "./label";

const meta = {
  component: Label,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Подпись к полю формы. Связывается с полем через htmlFor и гаснет вместе с отключённым полем.",
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};
