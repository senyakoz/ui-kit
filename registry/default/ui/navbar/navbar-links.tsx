"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "./navbar.types";

interface NavbarLinksProps {
  items: readonly NavItem[];
  pathname: string;
}

export function NavbarLinks({ items, pathname }: NavbarLinksProps) {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-nav-md transition-colors",
              active ? "text-primary" : "text-foreground hover:text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
