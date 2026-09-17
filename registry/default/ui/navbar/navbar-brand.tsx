"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export function NavbarBrand({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Dumbbell className="size-7 text-primary" />
      <span className="hidden text-xl font-semibold tracking-tight sm:inline">Prometey</span>
    </Link>
  );
}
