export const formatByteSize = (value: number | string | bigint | null | undefined): string => {
  const bytes = Number(value ?? 0);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const amount = bytes / 1024 ** unitIndex;

  return `${Number(amount.toFixed(2))} ${units[unitIndex]}`;
};
