import type { TKey } from "@/lib/i18n";
import type { ConnectionQuality, ControllerSupport, StreamingCompat } from "@/lib/types";

/** Relative "3h ago" style timestamp. */
export function relativeTime(iso: string | null, neverLabel: string): string {
  if (!iso) return neverLabel;
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.round(diff / 3600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  return `${mo}mo ago`;
}

/** Play time in hours/minutes. */
export function playTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const qualityKey = (q: ConnectionQuality): TKey => `quality.${q}` as TKey;
export const controllerKey = (c: ControllerSupport): TKey => `ctrl.${c}` as TKey;
export const compatKey = (c: StreamingCompat): TKey => `compat.${c}` as TKey;
