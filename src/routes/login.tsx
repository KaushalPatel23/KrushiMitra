import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import heroImage from "@/assets/hero-scan.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | KrushiMitr" },
      {
        name: "description",
        content:
          "Sign in to your KrushiMitr account to view crop analyses, reports and farm health history.",
      },
      { property: "og:title", content: "Login — KrushiMitr" },
      {
        property: "og:description",
        content: "Access your KrushiMitr farming dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hero-glow flex flex-col justify-center px-6 py-14 sm:px-14">
        <Logo />
        <div className="mx-auto w-full max-w-sm py-12">
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue diagnosing your fields.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Signed in");
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@farm.in"
                className="h-11 rounded-xl bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="h-11 rounded-xl bg-card"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toast.info("Password reset link sent")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"
            >
              Login <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or{" "}
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="h-11 w-full rounded-xl bg-card"
            onClick={() => toast.info("Google sign-in coming soon")}
          >
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to KrushiMitr?{" "}
            <Link to="/signup" className="font-medium text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={heroImage}
          alt="Farmer scanning a crop leaf with the KrushiMitr app"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="glass-panel absolute bottom-10 left-10 right-10 rounded-2xl p-6">
          <p className="font-display text-lg font-semibold">
            “We caught blight ten days earlier and saved a third of the crop.”
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ramesh Patil · Tomato grower, Nashik
          </p>
        </div>
      </div>
    </div>
  );
}