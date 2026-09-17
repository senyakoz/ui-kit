import Link from "next/link";

import { Button } from "@/registry/default/ui/button";

export function NavbarAuthActions() {
  return (
    <>
      <Button variant="outline" size="sm" shape="pill" asChild>
        <Link href="/login">Войти</Link>
      </Button>
      <Button size="sm" shape="pill" asChild>
        <Link href="/register">Начать бесплатно</Link>
      </Button>
    </>
  );
}
