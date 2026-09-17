import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary bg-gradient-primary text-primary-foreground hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "px-3 py-2",
        lg: "px-8 py-3",
        icon: "size-10",
        "icon-sm": "size-9",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-xl font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

/**
 * Пропсы кнопки. Дополняют нативные пропсы button вариантами оформления.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Отрисовать дочерний элемент вместо button, передав ему стили и пропсы.
   * Требует ровно один React-элемент в children, иначе кнопка отрисует обычный button.
   */
  asChild?: boolean;
  /**
   * Показать спиннер и заблокировать кнопку.
   */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const slotted = asChild && React.isValidElement(children);
    const Comp = slotted ? Slot : "button";
    const isDisabled = disabled || loading;

    if (process.env.NODE_ENV !== "production" && asChild && !slotted) {
      console.warn(
        "Button: asChild ожидает один React-элемент в children, получен другой тип. Отрисован обычный <button>.",
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape }),
          slotted && isDisabled && "pointer-events-none opacity-50",
          className,
        )}
        ref={ref}
        {...(slotted ? { "aria-disabled": isDisabled || undefined } : { disabled: isDisabled })}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {slotted ? <Slottable>{children}</Slottable> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
