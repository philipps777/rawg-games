export const fmtDate = (s) =>
  s
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${s}T00:00:00Z`))
    : "—";

export const year = (s) => (s ? s.slice(0, 4) : "—");