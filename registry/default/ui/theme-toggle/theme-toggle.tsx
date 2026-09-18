import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Skeleton } from "@/registry/default/ui/skeleton";

/**
 * Пропсы переключателя темы. Компонент controlled: состояние и переключение приходят снаружи,
 * сам он ничего не запрашивает. Нативные пропсы уходят на кнопку.
 */
export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Тёмная ли тема сейчас. Определяет иконку и подпись для скринридера.
   */
  isDark: boolean;
  /**
   * Запросить переключение темы. Не вызывается, если onClick отменил событие.
   */
  onToggleTheme: () => void;
  /**
   * Тема ещё неизвестна (например, до гидрации): вместо кнопки показывается заглушка.
   */
  pending?: boolean;
}

/**
 * Переключатель светлой и тёмной темы. Презентационный: получает `isDark` и `onToggleTheme`
 * пропсами, поэтому не зависит от провайдера темы и пригоден для любого потребителя.
 */
const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ isDark, onToggleTheme, pending = false, className, onClick, ...props }, ref) => {
    if (pending) {
      return <Skeleton className={cn("size-9 rounded-xl", className)} aria-hidden="true" />;
    }

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
          if (!event.defaultPrevented) onToggleTheme();
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
