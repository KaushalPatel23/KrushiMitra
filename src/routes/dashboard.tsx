import { useState, useEffect } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useUserLocation } from "@/lib/location";
import {
  FileText,
  Gauge,
  History,
  Menu,
  ScanLine,
  Settings,
  User,
  X,
} from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const nav = [
  { label: "Dashboard", to: "/dashboard" as const, icon: Gauge },
  { label: "Analyze Crop", to: "/upload" as const, icon: ScanLine },
  { label: "History", to: "/dashboard/history" as const, icon: History },
  { label: "Reports", to: "/dashboard/reports" as const, icon: FileText },
  { label: "Profile", to: "/dashboard/profile" as const, icon: User },
  { label: "Settings", to: "/dashboard/settings" as const, icon: Settings },
];

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { locationLabel, status } = useUserLocation({ autoRequest: true, reason: "to show your current location in the dashboard" });

  // Protect route: redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar p-5 transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              className="lg:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="glass-panel mt-8 rounded-2xl p-4">
            <p className="text-sm font-semibold">Season plan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlimited analyses and agronomist chat.
            </p>
            <Button
              asChild
              className="mt-4 h-9 w-full rounded-xl bg-gradient-primary text-primary-foreground"
            >
              <Link to="/upload">New Analysis</Link>
            </Button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="glass-nav sticky top-0 z-30 flex h-16 items-center justify-between px-5 sm:px-8">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="hidden text-sm text-muted-foreground lg:block">
              {status === "success" ? `Rabi season · ${locationLabel}` : "Rabi season · Location unavailable"}
            </p>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="rounded-full bg-card">
                <Link to="/">Back to site</Link>
              </Button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                {user
                  ? user.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "--"}
              </span>
            </div>
          </header>

          <main className="px-5 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}