import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Camera,
  Download,
  FlaskConical,
  Leaf,
  LineChart,
  Microscope,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { crops, stats } from "@/lib/krushi-data";
import heroImage from "@/assets/hero-scan.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrushiMitr — AI Powered Smart Farming Assistant" },
      {
        name: "description",
        content:
          "Upload a crop photo for instant AI disease detection, nutrient analysis and fertilizer recommendations across 20+ crops.",
      },
      {
        property: "og:title",
        content: "KrushiMitr — AI Powered Smart Farming Assistant",
      },
      {
        property: "og:description",
        content:
          "Upload a crop photo for instant AI disease detection, nutrient analysis and fertilizer recommendations across 20+ crops.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Microscope,
    title: "AI Disease Detection",
    desc: "Identify 120+ crop diseases from a single leaf photo with confidence scoring and severity grading.",
  },
  {
    icon: FlaskConical,
    title: "Nutrient Deficiency Detection",
    desc: "Spot nitrogen, potassium and micronutrient stress long before it costs you yield.",
  },
  {
    icon: Sprout,
    title: "Fertilizer Recommendation",
    desc: "Exact dosage guidance per acre, tuned to your crop stage, soil and detected deficiency.",
  },
  {
    icon: Leaf,
    title: "Organic Treatment Suggestion",
    desc: "Low-cost bio-solutions and preparations for growers moving toward chemical-free farming.",
  },
  {
    icon: LineChart,
    title: "Crop Health Monitoring",
    desc: "Track health scores season over season and see how each field responds to treatment.",
  },
  {
    icon: Bot,
    title: "AI Farming Assistant Chat",
    desc: "Ask anything about sowing, spraying or weather windows and get grounded, local answers.",
  },
];

const steps = [
  {
    icon: Camera,
    title: "Upload Crop Photo",
    desc: "Snap a leaf in the field or drag an image in from your gallery.",
  },
  {
    icon: ScanLine,
    title: "AI Analysis",
    desc: "Our vision models segment the leaf and read texture, colour and lesion patterns.",
  },
  {
    icon: Microscope,
    title: "Disease Detection",
    desc: "Get the disease name, confidence score and severity within seconds.",
  },
  {
    icon: FlaskConical,
    title: "Fertilizer Recommendation",
    desc: "Receive chemical and organic treatment plans with precise dosage.",
  },
  {
    icon: Download,
    title: "Download Report",
    desc: "Share a clean PDF summary with your agronomist or cooperative.",
  },
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-2 lg:pb-28 lg:pt-20">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Powered by agricultural vision AI
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                AI Powered <span className="text-gradient">Smart Farming</span>{" "}
                Assistant
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Upload a photo of your crop and receive instant disease
                detection, nutrient analysis, fertilizer recommendations, and
                personalized farming guidance powered by Artificial
                Intelligence.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-gradient-primary px-7 text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] hover:opacity-95"
                >
                  <Link to="/upload">
                    Analyze Crop <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border bg-card px-7 hover:bg-secondary"
                >
                  <Link to="/" hash="features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Trusted by farmer producer organisations across 9 states
              </div>
            </Reveal>
          </div>

          <Reveal delay={140} className="relative">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-primary opacity-15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-glow">
                <img
                  src={heroImage}
                  alt="Smartphone scanning a crop leaf with AI analysis overlay"
                  width={1200}
                  height={1200}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-primary-soft/60 to-transparent" />
              </div>

              <div className="glass-panel animate-float absolute -left-4 top-10 hidden rounded-2xl px-4 py-3 sm:block">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Health Score
                </p>
                <p className="font-display text-2xl font-semibold text-primary">
                  92<span className="text-sm text-muted-foreground">/100</span>
                </p>
              </div>
              <div className="glass-panel animate-float-slow absolute -right-4 bottom-12 hidden rounded-2xl px-4 py-3 sm:block">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Detected
                </p>
                <p className="text-sm font-semibold">Early Blight · 96%</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="glass-panel grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Everything your field needs, in one companion
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built with agronomists, trained on millions of field images, and
              tuned for real Indian farming conditions.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="surface-card lift-hover group h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-tint text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-secondary/50 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              From photo to prescription in under a minute
            </h2>
          </Reveal>

          <div className="relative mt-14">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" />
            <div className="space-y-6 md:space-y-10">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div
                    className={`md:flex md:items-center md:gap-8 ${
                      i % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="surface-card lift-hover p-6 md:w-[calc(50%-2rem)]">
                      <div className="flex items-start gap-4">
                        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                          <s.icon className="h-5 w-5" />
                          <span className="absolute inset-0 animate-ring rounded-xl border border-primary-soft" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Step {i + 1}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-16" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crops */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Supported crops
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Trained on the crops you actually grow
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {crops.map((c, i) => (
              <Reveal key={c.name} delay={(i % 4) * 60}>
                <div className="surface-card lift-hover group overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={c.image}
                      alt={`${c.name} crop`}
                      loading="lazy"
                      width={640}
                      height={640}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 to-transparent opacity-70" />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="font-medium">{c.name}</span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">
                      {c.season}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary px-8 py-16 text-center shadow-glow">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Diagnose your first crop today
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
              No agronomist visit, no lab wait. Just a photo and a plan.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-card px-7 text-foreground hover:bg-card/90"
              >
                <Link to="/upload">Analyze Crop</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/40 bg-transparent px-7 text-primary-foreground hover:bg-white/10"
              >
                <Link to="/signup">Create free account</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
