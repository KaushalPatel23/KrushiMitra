import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KrushiMitr — Talk to our agronomy team" },
      {
        name: "description",
        content:
          "Questions about crop diagnosis, partnerships or FPO onboarding? Reach the KrushiMitr team.",
      },
      { property: "og:title", content: "Contact KrushiMitr" },
      {
        property: "og:description",
        content: "Talk to our agronomy and support team.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              We'd love to hear from your field
            </h1>
            <p className="mt-5 text-muted-foreground">
              Support responds within one working day, in English, Hindi and
              Marathi.
            </p>
            <div className="mt-9 space-y-4">
              {[
                { icon: Mail, text: "hello@krushimitr.ai" },
                { icon: Phone, text: "+91 80 4567 1200" },
                { icon: MapPin, text: "Pune, Maharashtra, India" },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-tint text-primary">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{c.text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90}>
            <form
              className="surface-card space-y-4 p-7"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent — we'll reply shortly");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="c-name">Name</Label>
                <Input id="c-name" required className="h-11 rounded-xl bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  className="h-11 rounded-xl bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-msg">Message</Label>
                <Textarea
                  id="c-msg"
                  rows={5}
                  required
                  className="rounded-xl bg-card"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-primary text-primary-foreground"
              >
                Send message
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}