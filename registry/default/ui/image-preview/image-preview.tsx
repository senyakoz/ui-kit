import { cva, type VariantProps } from "class-variance-authority";
import { ImageOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const imagePreviewVariants = cva("relative w-full overflow-hidden bg-muted", {
  variants: {
    aspect: {
      portrait: "aspect-[4/5]",
      square: "aspect-square",
      landscape: "aspect-video",
    },
  },
  defaultVariants: {
    aspect: "portrait",
  },
});

/**
 * Пропсы превью изображения. Пропорции задаются вариантом aspect.
 */
export interface ImagePreviewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof imagePreviewVariants> {
  /**
   * Адрес изображения. Если не передан, показывается заглушка с иконкой.
   */
  url?: string;
  /**
   * Альтернативный текст для скринридеров и на случай, если картинка не загрузится.
   */
  alt?: string;
}

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ url, alt, aspect, className, ...props }, ref) => {
    const wrapper = cn(imagePreviewVariants({ aspect }), className);

    if (!url) {
      return (
        <div
          ref={ref}
          className={cn(wrapper, "flex items-center justify-center text-muted-foreground")}
          {...props}
        >
          <ImageOff className="size-6" />
        </div>
      );
    }

    return (
      <div ref={ref} className={wrapper} {...props}>
        {/* biome-ignore lint/performance/noImgElement: превью — динамический SVG с внешнего домена */}
        <img src={url} alt={alt} className="size-full object-contain" />
      </div>
    );
  },
);
ImagePreview.displayName = "ImagePreview";

export { ImagePreview, imagePreviewVariants };
