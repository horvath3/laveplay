import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Radio, Gauge, MonitorPlay, Film, ArrowUpRight, Signal } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useI18n } from "@/lib/i18n";
import { qualityKey } from "@/lib/format";
import type { StreamingStatus } from "@/lib/types";

/** Compact live-stream summary used on the Home dashboard. */
export function ActiveStreamCard({ stream }: { stream: StreamingStatus | null }) {
  const { t } = useI18n();
  const active = stream && stream.state === "streaming";

  return (
    <GlassCard glow className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">{t("home.activeStream")}</h3>
        <span
          className={
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold " +
            (active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")
          }
        >
          <span className={"h-2 w-2 rounded-full " + (active ? "bg-primary animate-pulse-ring" : "bg-muted-foreground")} />
          {active ? t("stream.active") : t("home.noStream")}
        </span>
      </div>

      {active ? (
        <>
          <div className="relative mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: MonitorPlay, label: t("stream.resolution"), value: stream!.resolution },
              { icon: Gauge, label: t("stream.fps"), value: `${stream!.fps}` },
              { icon: Radio, label: t("stream.bitrate"), value: `${stream!.bitrateMbps} Mbps` },
              { icon: Film, label: t("stream.codec"), value: stream!.codec },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate">{s.label}</span>
                </div>
                <p className="mt-1 font-display text-lg font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
          <Link
            to="/streaming"
            className="relative mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary-glow hover:shadow-[0_0_24px_oklch(0.73_0.19_129/0.5)]"
          >
            {t("home.openStream")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <div className="relative mt-6 flex flex-col items-center gap-3 py-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Signal className="h-6 w-6" />
          </span>
          <p className="text-sm text-muted-foreground">{t("home.noStreamDesc")}</p>
        </div>
      )}
    </GlassCard>
  );
}

/** Live connection-quality gauge used on the Home dashboard. */
export function ConnectionQualityCard({ stream }: { stream: StreamingStatus | null }) {
  const { t } = useI18n();
  const q = stream?.quality ?? "good";
  const score = { excellent: 96, good: 78, fair: 52, poor: 28 }[q];

  const bars = [
    { label: t("stream.latency"), value: `${stream?.latencyMs ?? "--"} ms`, pct: 100 - Math.min(100, (stream?.latencyMs ?? 20) * 2) },
    { label: t("stream.packetLoss"), value: `${stream?.packetLossPercent ?? 0}%`, pct: 100 - Math.min(100, (stream?.packetLossPercent ?? 0) * 20) },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-lg font-bold text-foreground">{t("home.connectionQuality")}</h3>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="absolute font-display text-xl font-bold text-foreground">{score}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-primary">{t(qualityKey(q))}</p>
          <div className="mt-3 space-y-3">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{b.label}</span>
                  <span className="font-mono text-foreground">{b.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(4, b.pct)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
