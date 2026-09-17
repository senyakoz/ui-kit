import { CircleAlert } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Пропсы блока ошибки.
 */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Заголовок ошибки.
   */
  title: string;
  /**
   * Пояснение: что именно пошло не так.
   */
  description?: string;
  /**
   * Действие для восстановления: обычно кнопка повтора запроса.
   */
  action?: React.ReactNode;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      <CircleAlert className="size-10 text-destructive" aria-hidden="true" />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  ),
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
