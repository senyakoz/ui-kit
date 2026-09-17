export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Prometey
      </div>
    </footer>
  );
}
Footer.displayName = "Footer";
