import { Skeleton } from "@/registry/default/ui/skeleton";
import { ThemeToggle } from "@/registry/default/ui/theme-toggle";
import type { NavbarProps } from "./navbar.types";
import { NavbarAuthActions } from "./navbar-auth-actions";
import { NavbarBrand } from "./navbar-brand";
import { NavbarLinks } from "./navbar-links";
import { NavbarMobileMenu } from "./navbar-mobile-menu";
import { NavbarUserMenu } from "./navbar-user-menu";

export function Navbar({
  items,
  pathname,
  brandHref,
  isAuthenticated,
  isLoading = false,
  userName = "",
  userEmail = "",
  onLogout,
}: NavbarProps) {
  const initials = userName.slice(0, 2).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-[var(--z-nav)] border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:gap-6 md:px-6">
        <NavbarBrand href={brandHref} />

        {isAuthenticated && <NavbarLinks items={items} pathname={pathname} />}

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && <NavbarMobileMenu items={items} />}

          {isLoading ? (
            <Skeleton className="h-8 w-28 rounded-xl" />
          ) : isAuthenticated ? (
            <NavbarUserMenu
              name={userName}
              email={userEmail}
              initials={initials}
              logout={onLogout}
            />
          ) : (
            <NavbarAuthActions />
          )}
        </div>
      </div>
    </header>
  );
}
Navbar.displayName = "Navbar";
