import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/site/Reveal";
import { StatusPill } from "@/components/site/StatusPill";
import { historyItems } from "@/lib/krushi-data";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({
    meta: [
      { title: "Analysis History | KrushiMitr" },
      {
        name: "description",
        content:
          "Search, filter and download every past crop analysis performed with KrushiMitr.",
      },
      { property: "og:title", content: "Analysis History — KrushiMitr" },
      {
        property: "og:description",
        content: "A timeline of every crop scan you've run.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const rows = useMemo(() => {
    let list = historyItems.filter(
      (h) =>
        (status === "all" || h.status === status) &&
        (h.crop.toLowerCase().includes(query.toLowerCase()) ||
          h.disease.toLowerCase().includes(query.toLowerCase()) ||
          h.id.toLowerCase().includes(query.toLowerCase())),
    );
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? b.date.localeCompare(a.date)
        : sort === "oldest"
          ? a.date.localeCompare(b.date)
          : b.score - a.score,
    );
    return list;
  }, [query, status, sort]);

  return (
    <div className="space-y-8">
      <Reveal>
        <h1 className="text-2xl font-semibold sm:text-3xl">Analysis History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every scan, diagnosis and treatment plan in one timeline.
        </p>
      </Reveal>

      <Reveal delay={60}>
        <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crop, disease or ID"
              className="h-11 rounded-xl bg-card pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 rounded-xl bg-card sm:w-44">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Healthy">Healthy</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Diseased">Diseased</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 rounded-xl bg-card sm:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="score">Highest score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Reveal>

      <div className="relative space-y-4 pl-6">
        <span className="absolute left-1.5 top-2 h-[calc(100%-1rem)] w-px bg-border" />
        {rows.map((h, i) => (
          <Reveal key={h.id} delay={i * 60}>
            <div className="relative">
              <span className="absolute -left-[1.35rem] top-7 h-3 w-3 rounded-full border-2 border-background bg-gradient-primary" />
              <div className="surface-card lift-hover flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {h.date} · {h.id}
                  </p>
                  <p className="mt-1 font-medium">
                    {h.crop} — {h.disease}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Health score {h.score}/100
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={h.status} />
                  <Button
                    variant="outline"
                    className="rounded-full bg-card"
                    onClick={() => toast.success(`Report ${h.id} downloaded`)}
                  >
                    <Download className="mr-1 h-4 w-4" /> Report
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No analyses found.</p>
        )}
      </div>
    </div>
  );
}