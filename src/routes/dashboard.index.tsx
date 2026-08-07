import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Reveal } from "@/components/site/Reveal";
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

type AnalysisRecord = {
  id: string;
  cropName: string;
  disease?: string | null;
  healthStatus: string;
  confidence: number;
  createdAt: string;
};

function DashboardHome() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/analysis");
        setAnalyses(res.data ?? []);
      } catch {
        setAnalyses([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const kpis = useMemo(() => {
    const total = analyses.length;
    const averageScore = total
      ? Math.round(analyses.reduce((sum, item) => sum + (item.confidence ?? 0), 0) / total)
      : 0;
    const alerts = analyses.filter((item) => (item.healthStatus || "").toLowerCase().includes("risk") || (item.healthStatus || "").toLowerCase().includes("disease")).length;
    const fieldsMonitored = new Set(analyses.map((item) => item.cropName)).size;

    return [
      { label: "Analyses this season", value: String(total), icon: ScanLine, delta: total ? `${total} total` : "0" },
      { label: "Average health score", value: `${averageScore}%`, icon: Activity, delta: `${averageScore >= 70 ? "+" : ""}${averageScore - 70} pts` },
      { label: "Active alerts", value: String(alerts), icon: TriangleAlert, delta: alerts ? `${alerts} flagged` : "0" },
      { label: "Fields monitored", value: String(fieldsMonitored), icon: Leaf, delta: fieldsMonitored ? `${fieldsMonitored} crops` : "0" },
    ];
  }, [analyses]);

  const chartData = useMemo(() => {
    return analyses
      .slice(0, 6)
      .reverse()
      .map((item, index) => ({
        month: index === 0 ? "Today" : `Scan ${index}`,
        score: Math.max(0, Math.min(100, Math.round(item.confidence ?? 0))),
      }));
  }, [analyses]);

  const diseaseData = useMemo(() => {
    const counts = analyses.reduce<Record<string, number>>((acc, item) => {
      const key = item.disease || item.healthStatus || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, cases]) => ({ name, cases }));
  }, [analyses]);

  const recentAnalyses = analyses.slice(0, 5);

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Welcome back, {user?.name ?? "farmer"}
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
                <AreaChart data={chartData.length ? chartData : [{ month: "No data", score: 0 }] }>
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
                <BarChart data={diseaseData.length ? diseaseData : [{ name: "No data", cases: 0 }] }>
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-muted-foreground">
                      Loading your recent analyses…
                    </td>
                  </tr>
                ) : recentAnalyses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-muted-foreground">
                      No analyses yet. Upload your first crop photo to get started.
                    </td>
                  </tr>
                ) : recentAnalyses.map((h) => (
                  <tr key={h.id} className="border-t border-border">
                    <td className="py-3 font-medium">{h.id.slice(0, 8)}</td>
                    <td className="py-3">{h.cropName}</td>
                    <td className="py-3 text-muted-foreground">{h.disease ?? "Pending"}</td>
                    <td className="py-3">{Math.round(h.confidence)}%</td>
                    <td className="py-3">
                      <StatusPill status={h.healthStatus} />
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(h.createdAt).toLocaleDateString()}</td>
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