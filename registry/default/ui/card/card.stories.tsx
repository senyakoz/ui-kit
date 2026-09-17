import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/registry/default/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  component: Card,
  tags: ["ai-generated"],
  parameters: {
    docs: {
      description: {
        component:
          "Карточка-контейнер. Состав: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Fill in the details to create your project.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[300px] p-6">
      <CardTitle>Quick note</CardTitle>
      <CardDescription className="mt-2">
        A minimal card with no header/footer sections.
      </CardDescription>
    </Card>
  ),
};
