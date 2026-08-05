import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { historyItems } from "@/lib/krushi-data";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({
    meta: [
      { title: "Reports | KrushiMitr" },
      {
        name: "description",
        content:
          "Download shareable PDF-style crop diagnosis reports for your agronomist or cooperative.",
      },
      { property: "og:title", content: "Reports — KrushiMitr" },
      {
        property: "og:description",
        content: "Shareable crop diagnosis reports.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-8">
      <Reveal>
        <h1 className="text-2xl font-semibold sm:text-3xl">Recent Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Field-ready summaries generated after every analysis.
        </p>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {historyItems.map((h, i) => (
          <Reveal key={h.id} delay={i * 60}>
            <div className="surface-card lift-hover p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-tint text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <p className="mt-4 font-medium">
                {h.crop} analysis · {h.id}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {h.disease} · {h.date}
              </p>
              <Button
                variant="outline"
                className="mt-5 w-full rounded-xl bg-card"
                onClick={() => toast.success(`Report ${h.id} downloaded`)}
              >
                <Download className="mr-1 h-4 w-4" /> Download Report
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}