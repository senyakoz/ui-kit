import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
  });

  it("applies icon-sm size classes", () => {
    render(
      <Button size="icon-sm" aria-label="Icon">
        ✦
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Icon" })).toHaveClass("size-9");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-input");
    expect(button).toHaveClass("bg-background");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");
    expect(button).toHaveClass("text-secondary-foreground");
  });

  it("renders as an anchor with asChild", () => {
    render(
      <Button asChild>
        <a href="/login">Войти</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Войти" })).toHaveClass("bg-primary");
  });

  it("falls back to a button when asChild gets no element child", () => {
    render(<Button asChild>Просто текст</Button>);
    expect(screen.getByRole("button", { name: "Просто текст" })).toBeInTheDocument();
  });

  it("keeps the spinner and marks aria-disabled when loading with asChild", () => {
    render(
      <Button asChild loading>
        <a href="/login">Войти</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Войти" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("calls click handler on user click", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
