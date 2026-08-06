import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const links: { label: string; to: "/" | "/about" | "/contact"; hash?: string }[] =
  [
    { label: "Home", to: "/" },
    { label: "Features", to: "/", hash: "features" },
    { label: "How it Works", to: "/", hash: "how-it-works" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              {...(l.hash ? { hash: l.hash } : {})}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {auth.user ? (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <span className="text-sm">Hi, {auth.user.name}</span>
              <Button
                variant="ghost"
                onClick={() => {
                  auth.logout();
                  navigate({ to: "/" });
                }}
                className="rounded-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="glass-panel mx-4 mb-3 rounded-2xl p-3 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
            {auth.user ? (
              <>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    auth.logout();
                    setOpen(false);
                    navigate({ to: "/" });
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl bg-gradient-primary text-primary-foreground"
                >
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}