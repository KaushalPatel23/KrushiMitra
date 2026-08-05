import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Download,
  Droplets,
  FlaskConical,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { sampleResult } from "@/lib/krushi-data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Crop Analysis Report | KrushiMitr" },
      {
        name: "description",
        content:
          "Disease, confidence, severity, nutrient status and fertilizer plan for your analyzed crop photo.",
      },
      { property: "og:title", content: "Crop Analysis Report — KrushiMitr" },
      {
        property: "og:description",
        content: "Your AI crop diagnosis and treatment plan.",
      },
    ],
  }),
  component: ResultsPage,
});

const r = sampleResult;

function ResultsPage() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      setImage(sessionStorage.getItem("krushimitr:image"));
    } catch {
      /* ignore */
    }
  }, []);

  const downloadReport = () => {
    const lines = [
      "KrushiMitr — Crop Analysis Report",
      "==================================",
      `Crop: ${r.crop}`,
      `Health status: ${r.healthStatus}`,
      `Disease: ${r.disease}`,
      `Confidence: ${r.confidence}%`,
      `Severity: ${r.severity}`,
      `Crop health score: ${r.healthScore}/100`,
      `Nutrient deficiency: ${r.nutrientDeficiency}`,
      `Recommended fertilizer: ${r.fertilizer}`,
      `Organic solution: ${r.organicSolution}`,
      `Recommended pesticide: ${r.pesticide}`,
      `Water requirement: ${r.water}`,
      `Recovery time: ${r.recovery}`,
      "",
      "Prevention tips:",
      ...r.preventionTips.map((t) => `- ${t}`),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([lines], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "krushimitr-report.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Analysis complete
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                {r.crop} · {r.disease.split(" (")[0]}
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
                  <RefreshCw className="mr-1 h-4 w-4" /> Analyze Another Crop
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-1">
              <div className="surface-card overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-secondary">
                  {image ? (
                    <img
                      src={image}
                      alt="Analyzed crop"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-6">
                  <Row label="Crop" value={r.crop} />
                  <Row
                    label="Health status"
                    value={
                      <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                        {r.healthStatus}
                      </span>
                    }
                  />
                  <Row
                    label="Severity"
                    value={
                      <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning-foreground">
                        {r.severity}
                      </span>
                    }
                  />
                  <Row label="Confidence" value={`${r.confidence}%`} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-2">
              <div className="grid h-full gap-6 sm:grid-cols-2">
                <div className="surface-card flex flex-col p-6">
                  <p className="text-sm font-semibold">Crop Health Score</p>
                  <div className="relative mt-4 h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="72%"
                        outerRadius="100%"
                        data={[{ name: "score", value: r.healthScore }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          tick={false}
                        />
                        <RadialBar
                          dataKey="value"
                          cornerRadius={20}
                          fill="var(--warning)"
                          background={{ fill: "var(--secondary)" }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                      <p className="font-display text-4xl font-semibold">
                        {r.healthScore}
                        <span className="text-base text-muted-foreground">
                          /100
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Needs attention — treat within 3 days
                  </p>
                </div>

                <div className="surface-card p-6">
                  <p className="text-sm font-semibold">Nutrient Levels</p>
                  <div className="mt-5 space-y-4">
                    {r.nutrients.map((n) => (
                      <div key={n.name}>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {n.name}
                          </span>
                          <span
                            className={
                              n.level < 50
                                ? "text-danger"
                                : n.level < 70
                                  ? "text-warning-foreground"
                                  : "text-primary"
                            }
                          >
                            {n.level}%
                          </span>
                        </div>
                        <Progress value={n.level} className="mt-2 h-2" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 rounded-xl bg-danger/8 px-3 py-2 text-xs text-danger">
                    Deficiency detected: {r.nutrientDeficiency}
                  </p>
                </div>

                <InfoCard
                  icon={FlaskConical}
                  title="Recommended Fertilizer"
                  body={r.fertilizer}
                />
                <InfoCard
                  icon={Leaf}
                  title="Organic Solution"
                  body={r.organicSolution}
                />
                <InfoCard
                  icon={AlertTriangle}
                  title="Recommended Pesticide"
                  body={r.pesticide}
                />
                <InfoCard
                  icon={Droplets}
                  title="Water Requirement"
                  body={r.water}
                />
                <InfoCard
                  icon={Timer}
                  title="Recovery Time"
                  body={r.recovery}
                />
                <div className="surface-card p-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Prevention Tips</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {r.preventionTips.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="surface-card lift-hover p-6">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-tint text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}