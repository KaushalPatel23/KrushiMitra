import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | KrushiMitr" },
      {
        name: "description",
        content:
          "The terms that govern use of the KrushiMitr AI crop diagnosis platform and its recommendations.",
      },
      { property: "og:title", content: "Terms of Service — KrushiMitr" },
      {
        property: "og:description",
        content: "Terms governing use of KrushiMitr.",
      },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Using KrushiMitr",
    body: "You may use the platform for lawful agricultural purposes. Keep your account credentials secure.",
  },
  {
    title: "Advisory nature",
    body: "Diagnoses and dosages are decision support, not a substitute for a licensed agronomist or label instructions on agri-inputs.",
  },
  {
    title: "Content ownership",
    body: "You retain ownership of the photos you upload. You grant us a limited licence to process them to deliver your results.",
  },
  {
    title: "Changes",
    body: "We may update these terms as the product evolves; material changes will be announced in the app.",
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <h1 className="text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated August 2026.</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}