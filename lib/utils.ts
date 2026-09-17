import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "body-lg",
            "body-md",
            "link",
            "nav-md",
            "nav-sm",
            "meta",
            "caption",
          ],
        },
      ],
      "bg-image": [
        {
          "bg-gradient": ["primary"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
