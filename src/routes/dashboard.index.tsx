import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Download,
  Leaf,
  ScanLine,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { diseaseTrend, healthTrend, historyItems } from "@/lib/krushi-data";
import { StatusPill } from "@/components/site/StatusPill";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard | KrushiMitr" },
      {
        name: "description",
        content:
          "Track crop health scores, disease trends, recent analyses and reports across your fields.",
      },
      { property: "og:title", content: "Farmer Dashboard — KrushiMitr" },
      {
        property: "og:description",
        content: "Your crop health command center.",
      },
    ],
  }),
  component: DashboardHome,
});

const kpis = [
  { label: "Analyses this season", value: "148", icon: ScanLine, delta: "+12%" },
  { label: "Average health score", value: "84", icon: Activity, delta: "+6 pts" },
  { label: "Active alerts", value: "3", icon: TriangleAlert, delta: "-2" },
  { label: "Fields monitored", value: "9", icon: Leaf, delta: "+1" },
];

function DashboardHome() {
  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Good morning, Ramesh
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's how your fields are doing today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              className="rounded-full bg-gradient-primary text-primary-foreground"
            >
              <Link to="/upload">
                <ScanLine className="mr-1 h-4 w-4" /> Analyze Crop
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-card">
              <Link to="/dashboard/reports">
                <Download className="mr-1 h-4 w-4" /> Reports
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 70}>
            <div className="surface-card lift-hover p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-tint text-primary">
                  <k.icon className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <TrendingUp className="h-3 w-3" /> {k.delta}
                </span>
              </div>
              <p className="mt-5 font-display text-3xl font-semibold">
                {k.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{k.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="surface-card p-6">
            <p className="text-sm font-semibold">Crop Health Score</p>
            <p className="text-xs text-muted-foreground">
              Rolling average across all monitored fields
            </p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrend}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--primary-soft)"
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary-soft)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    domain={[50, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fill="url(#scoreFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="surface-card h-full p-6">
            <p className="text-sm font-semibold">Disease Trends</p>
            <p className="text-xs text-muted-foreground">
              Detected cases in the last 90 days
            </p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseTrend}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--secondary)" }}
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar
                    dataKey="cases"
                    fill="var(--accent)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Recent Analyses</p>
            <Link
              to="/dashboard/history"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Crop</th>
                  <th className="pb-3 font-medium">Diagnosis</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.slice(0, 5).map((h) => (
                  <tr key={h.id} className="border-t border-border">
                    <td className="py-3 font-medium">{h.id}</td>
                    <td className="py-3">{h.crop}</td>
                    <td className="py-3 text-muted-foreground">{h.disease}</td>
                    <td className="py-3">{h.score}</td>
                    <td className="py-3">
                      <StatusPill status={h.status} />
                    </td>
                    <td className="py-3 text-muted-foreground">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
}