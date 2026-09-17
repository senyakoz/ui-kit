import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/registry/default/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  component: Sheet,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Панель, выезжающая с края экрана. Сторона задаётся пропсом side у SheetContent.",
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function render(side: "top" | "bottom" | "left" | "right") {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Открыть</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Заголовок</SheetTitle>
          <SheetDescription>Описание панели.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = {
  render: () => render("right"),
};

export const Top: Story = {
  render: () => render("top"),
};

export const Bottom: Story = {
  render: () => render("bottom"),
};

export const Left: Story = {
  render: () => render("left"),
};

export const Right: Story = {
  render: () => render("right"),
};
