import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/site/Reveal";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile | KrushiMitr" },
      {
        name: "description",
        content:
          "Manage your farm details, preferred crops, location and language preferences.",
      },
      { property: "og:title", content: "Farmer Profile — KrushiMitr" },
      {
        property: "og:description",
        content: "Your farm profile and preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

const preferred = ["Tomato", "Wheat", "Cotton", "Onion"];

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <Reveal>
        <h1 className="text-2xl font-semibold sm:text-3xl">Farmer Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your farm details current for sharper recommendations.
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal>
            <div className="surface-card p-6 text-center">
            <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-primary font-display text-3xl font-semibold text-primary-foreground shadow-glow">
              {user
                ? user.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "--"}
            </span>
            <p className="mt-5 text-lg font-semibold">{user?.name ?? "Farmer"}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Nashik, Maharashtra
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {preferred.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-2">
            <form
            className="surface-card grid gap-5 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Profile updated");
            }}
          >
            <Field label="Name" defaultValue={user?.name ?? ""} />
            <Field label="Location" defaultValue="Nashik, Maharashtra" />
            <Field label="Farm Size" defaultValue="12 acres" />
            <Field label="Preferred Crops" defaultValue="Tomato, Wheat, Cotton" />
            <Field label="Language" defaultValue="Marathi" />
            <Field label="Phone" defaultValue="+91 98765 43210" />
            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="rounded-full bg-gradient-primary text-primary-foreground"
              >
                <Pencil className="mr-1 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} className="h-11 rounded-xl bg-card" />
    </div>
  );
}