"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/registry/default/ui/sheet";
import type { NavItem } from "./navbar.types";

interface NavbarMobileMenuProps {
  items: readonly NavItem[];
}

export function NavbarMobileMenu({ items }: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Меню">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="sr-only">Навигация</SheetTitle>
        <nav className="flex flex-col gap-2 p-4">
          {items.map((item) => (
            <Button key={item.href} variant="ghost" className="justify-start" asChild>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
