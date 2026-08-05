import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { stats } from "@/lib/krushi-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KrushiMitr — Our AgriTech Mission" },
      {
        name: "description",
        content:
          "KrushiMitr builds affordable AI crop diagnostics so every smallholder farmer gets agronomist-grade advice.",
      },
      { property: "og:title", content: "About KrushiMitr" },
      {
        property: "og:description",
        content: "Why we build AI crop diagnostics for smallholder farmers.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              About us
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
              Agronomist-grade advice, for every acre
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Most crop losses are avoidable. They happen because diagnosis
              arrives late — after the lesion spreads, after the deficiency
              stunts the plant. KrushiMitr compresses that gap to seconds by
              putting a trained agricultural vision model in every farmer's
              pocket.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              We work with agronomists, agricultural universities and farmer
              producer organisations to validate every recommendation on real
              fields before it reaches your screen. Recommendations always come
              in both chemical and organic form, priced for smallholder
              realities.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="surface-card p-6 text-center">
                  <p className="font-display text-2xl font-semibold text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}