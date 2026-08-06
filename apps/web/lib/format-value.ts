export function formatValue(value: unknown): string {
  // null / undefined
  if (value === null || value === undefined) {
    return "—";
  }

  // boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // number
  if (typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  // bigint
  if (typeof value === "bigint") {
    return value.toString();
  }

  // string
  if (typeof value === "string") {
    const trimmed = value.trim();

    // Empty string
    if (!trimmed) {
      return "—";
    }

    // ISO Date detection
    if (isIsoDate(trimmed)) {
      return formatDate(trimmed);
    }

    return trimmed;
  }

  // Array
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  // Object
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(date);
}
