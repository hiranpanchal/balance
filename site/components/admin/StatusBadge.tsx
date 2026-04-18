type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

const styles: Record<Status, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  NO_SHOW: "bg-gray-100 text-gray-500 border-gray-200",
};

const labels: Record<Status, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No show",
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as Status;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] tracking-[0.06em] border ${
        styles[s] ?? "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      {labels[s] ?? status}
    </span>
  );
}
