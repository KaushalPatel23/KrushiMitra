import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings | KrushiMitr" },
      {
        name: "description",
        content:
          "Control alerts, weather notifications, language and data preferences for your KrushiMitr account.",
      },
      { property: "og:title", content: "Settings — KrushiMitr" },
      {
        property: "og:description",
        content: "Manage your KrushiMitr preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const options = [
  {
    id: "disease-alerts",
    title: "Disease outbreak alerts",
    desc: "Get notified when a disease spreads in your district.",
    on: true,
  },
  {
    id: "weather",
    title: "Spray window notifications",
    desc: "Weather-aware reminders before you spray.",
    on: true,
  },
  {
    id: "reports",
    title: "Weekly report email",
    desc: "A Monday summary of every field's health score.",
    on: false,
  },
  {
    id: "research",
    title: "Contribute anonymised images",
    desc: "Help improve detection accuracy for all farmers.",
    on: true,
  },
];

function SettingsPage() {
  return (
    <div className="space-y-8">
      <Reveal>
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tune how KrushiMitr works for your farm.
        </p>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-2">
        {options.map((o, i) => (
          <Reveal key={o.id} delay={i * 60}>
            <div className="surface-card flex items-start justify-between gap-6 p-6">
              <div>
                <Label htmlFor={o.id} className="text-base font-semibold">
                  {o.title}
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
              </div>
              <Switch
                id={o.id}
                defaultChecked={o.on}
                onCheckedChange={() => toast.success("Preference saved")}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}