"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Skeleton } from "@/registry/default/ui/skeleton";

/**
 * Пропсы переключателя темы. Нативные пропсы уходят на кнопку.
 */
export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Тумблер светлой и тёмной темы на next-themes. Пока пользователь не нажимал,
 * действует системная тема; нажатие переключает на противоположную видимой и запоминает выбор.
 * До монтирования показывает заглушку того же размера, чтобы SSR-разметка совпала с клиентской.
 */
const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, onClick, ...props }, ref) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <Skeleton className={cn("size-9 rounded-xl", className)} aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";
    const Icon = isDark ? Moon : Sun;

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon-sm"
        shape="pill"
        className={className}
        aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setTheme(isDark ? "light" : "dark");
        }}
        {...props}
      >
        <Icon aria-hidden="true" />
      </Button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
