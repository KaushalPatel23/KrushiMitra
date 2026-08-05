import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | KrushiMitr" },
      {
        name: "description",
        content:
          "How KrushiMitr collects, stores and protects your crop images, farm data and account information.",
      },
      { property: "og:title", content: "Privacy Policy — KrushiMitr" },
      {
        property: "og:description",
        content: "How we handle your farm data.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "What we collect",
    body: "Account details you provide, crop images you upload, and basic usage analytics that help us improve detection accuracy.",
  },
  {
    title: "How images are used",
    body: "Crop photos are processed to generate your diagnosis. Images are only used to improve our models when you opt in from Settings.",
  },
  {
    title: "Sharing",
    body: "We never sell farm data. Aggregated, anonymised disease trends may be shared with agricultural research partners.",
  },
  {
    title: "Your control",
    body: "You can export or delete your analyses and account at any time from the dashboard.",
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated August 2026.
        </p>
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