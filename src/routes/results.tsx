import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useUserLocation } from "@/lib/location";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Crop Upload Complete | KrushiMitr" },
      {
        name: "description",
        content:
          "Your crop image has been uploaded. Analysis is pending and will appear once the model is ready.",
      },
      { property: "og:title", content: "Crop Upload Complete — KrushiMitr" },
      {
        property: "og:description",
        content: "Your crop image has been stored and analysis is pending.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [image, setImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState<string | null>(null);
  const [analysisObj, setAnalysisObj] = useState<any | null>(null);
  const { locationLabel, status } = useUserLocation({ autoRequest: true, reason: "to show the location of this analysis" });

  useEffect(() => {
    try {
      const imageData = sessionStorage.getItem("krushimitr:image");
      const analysis = sessionStorage.getItem("krushimitr:analysis");

      if (analysis) {
        const parsed = JSON.parse(analysis) as any;
        setAnalysisObj(parsed ?? null);
        setCropName(parsed?.cropName ?? null);
        setImage(imageData ?? parsed?.imageUrl ?? null);
      } else {
        setImage(imageData);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const downloadReport = () => {
    const lines = [
      "KrushiMitr � Crop Upload Report",
      "==================================",
      `Crop: ${cropName ?? "Unknown"}`,
      `Health status: ${analysisObj?.healthStatus ?? "Pending"}`,
      `Disease: ${analysisObj?.disease ?? "Pending analysis"}`,
      `Confidence: ${Math.round(analysisObj?.confidence ?? 0)}%`,
      `Location: ${analysisObj?.location ?? (status === "success" ? locationLabel : "Location unavailable")}`,
      "Severity: Pending",
      "",
      "Your crop photo has been uploaded successfully.",
      "Analysis results will appear once the model has processed your image.",
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([lines], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "krushimitr-upload-report.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Upload complete
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                {cropName ?? "Crop"} image saved
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={downloadReport}
                className="rounded-full bg-gradient-primary text-primary-foreground"
              >
                <Download className="mr-1 h-4 w-4" /> Download Report
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-card">
                <Link to="/upload">
                  <RefreshCw className="mr-1 h-4 w-4" /> Upload Another Crop
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
            <Reveal>
              <div className="surface-card overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-secondary">
                  {image ? (
                    <img
                      src={image}
                      alt="Submitted crop"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="surface-card p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Analysis uploaded
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  {cropName ?? "Crop"} analysis details
                </h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Your photo, selected crop, and location are now attached to the analysis record and can be reviewed from your dashboard.
                </p>
                <div className="mt-6 space-y-3 rounded-3xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
                  <p>
                    Crop: <span className="font-semibold text-foreground">{analysisObj?.cropName ?? cropName ?? "Not selected"}</span>
                  </p>
                  <p>
                    Status: <span className="font-semibold text-foreground">{analysisObj?.healthStatus ?? "Pending"}</span>
                  </p>
                  <p>
                    Confidence: <span className="font-semibold text-foreground">{Math.round(analysisObj?.confidence ?? 0)}%</span>
                  </p>
                  <p>
                    Location: <span className="font-semibold text-foreground">{analysisObj?.location ?? (status === "success" ? locationLabel : "Location unavailable")}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
