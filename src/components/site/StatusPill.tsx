export function StatusPill({
  status,
}: {
  status: "Healthy" | "At Risk" | "Diseased";
}) {
  const styles =
    status === "Healthy"
      ? "bg-primary-tint text-primary"
      : status === "At Risk"
        ? "bg-warning/15 text-warning-foreground"
        : "bg-danger/10 text-danger";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}