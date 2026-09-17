import { Inbox } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Пропсы заглушки для пустого списка.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Заголовок: коротко о том, почему пусто.
   */
  title: string;
  /**
   * Пояснение под заголовком.
   */
  description?: string;
  /**
   * Действие, которое исправит пустоту: обычно кнопка создания.
   */
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      <Inbox className="size-10 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
