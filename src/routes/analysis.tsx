import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { analysisStages } from "@/lib/krushi-data";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "AI Analysis in Progress | KrushiMitr" },
      {
        name: "description",
        content:
          "KrushiMitr AI is scanning your crop photo for disease, nutrient deficiency and treatment recommendations.",
      },
      { property: "og:title", content: "AI Analysis in Progress — KrushiMitr" },
      {
        property: "og:description",
        content: "Live AI scanning of your uploaded crop photo.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    try {
      const imageData = sessionStorage.getItem("krushimitr:image");
      const analysis = sessionStorage.getItem("krushimitr:analysis");
      if (analysis) {
        const parsed = JSON.parse(analysis) as {
          cropName?: string;
          imageUrl?: string;
        };
        setCropName(parsed.cropName ?? null);
        setImage(imageData ?? parsed.imageUrl ?? null);
      } else {
        setImage(imageData);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => Math.min(100, p + 1.4));
    }, 60);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const next = Math.min(
      analysisStages.length - 1,
      Math.floor(progress / (100 / analysisStages.length)),
    );
    setStage(next);
    if (progress >= 100) {
      const t = setTimeout(() => navigate({ to: "/results" }), 600);
      return () => clearTimeout(t);
    }
    return;
  }, [progress, navigate]);

  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow">
              {image ? (
                <img
                  src={image}
                  alt="Crop being analyzed"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center bg-secondary text-sm text-muted-foreground">
                  No image uploaded
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_18%,transparent)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-scan bg-gradient-to-b from-primary-soft/70 to-transparent" />
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Analysis in progress
              </p>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                Crop: {cropName ?? "Unknown"}
              </span>
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Analyzing your crop
            </h1>
            <p className="mt-3 text-muted-foreground">
              Our vision models are reading leaf texture, colour variance and
              lesion morphology.
            </p>

            <Progress value={progress} className="mt-8 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>

            <ul className="mt-8 space-y-3">
              {analysisStages.map((label, i) => {
                const done = i < stage || progress >= 100;
                const active = i === stage && progress < 100;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                      done
                        ? "border-primary/25 bg-primary-tint"
                        : active
                          ? "border-primary/40 bg-card shadow-soft"
                          : "border-border bg-card/50 opacity-60"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full ${
                        done
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-[11px]">{i + 1}</span>
                      )}
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}