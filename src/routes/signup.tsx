import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import heroImage from "@/assets/hero-scan.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account | KrushiMitr" },
      {
        name: "description",
        content:
          "Create your free KrushiMitr account and start diagnosing crop disease from photos today.",
      },
      { property: "og:title", content: "Create Account — KrushiMitr" },
      {
        property: "og:description",
        content: "Join 50,000+ farmers using AI crop diagnosis.",
      },
    ],
  }),
  component: SignupPage,
});

const fields = [
  { id: "name", label: "Name", type: "text", placeholder: "Ramesh Patil" },
  { id: "email", label: "Email", type: "email", placeholder: "you@farm.in" },
  { id: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
  {
    id: "confirm",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={heroImage}
          alt="AI crop scanning in a green field"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="glass-panel absolute bottom-10 left-10 right-10 rounded-2xl p-6">
          <p className="font-display text-lg font-semibold">
            98% detection accuracy across 20+ crops
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Trained with agronomists and validated on field trials.
          </p>
        </div>
      </div>

      <div className="hero-glow flex flex-col justify-center px-6 py-14 sm:px-14">
        <Logo />
        <div className="mx-auto w-full max-w-sm py-10">
          <h1 className="text-3xl font-semibold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free forever for smallholder farms.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Account created");
              navigate({ to: "/dashboard" });
            }}
          >
            {fields.map((f) => (
              <div key={f.id} className="space-y-2">
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input
                  id={f.id}
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  className="h-11 rounded-xl bg-card"
                />
              </div>
            ))}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}