import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  MonitorPlay,
  Gauge,
  Radio,
  Film,
  Signal,
  Waves,
  Volume2,
  VolumeX,
  Gamepad2,
  Sparkles,
  Square,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { StatMeter } from "@/components/StatMeter";
import { useI18n } from "@/lib/i18n";
import { StreamingService } from "@/services";
import type { StreamingStatus } from "@/lib/types";
import { qualityKey } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/streaming")({
  head: () => ({
    meta: [
      { title: "Streaming — Lave Play" },
      { name: "description", content: "Live cloud streaming session: resolution, FPS, bitrate, codec, latency and audio status." },
    ],
  }),
  component: StreamingPage,
});

function Metric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <GlassCard hover className="p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn("h-4 w-4", accent ? "text-primary" : "text-muted-foreground")} />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
    </GlassCard>
  );
}

function StreamingPage() {
  const { t } = useI18n();
  const [s, setS] = useState<StreamingStatus | null>(null);

  useEffect(() => {
    StreamingService.getStatus().then(setS);
    const off = StreamingService.subscribe(setS);
    return off;
  }, []);

  const stateLabel = (state?: StreamingStatus["state"]) =>
    state === "streaming" ? t("stream.active") : state === "connecting" ? t("stream.connecting") : t("stream.idle");

  // Empty / idle state
  if (s && s.state === "idle") {
    return (
      <AppLayout>
        <Header title={t("stream.title")} subtitle={t("stream.subtitle")} state={s.state} label={stateLabel(s.state)} />
        <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-muted text-muted-foreground">
            <Signal className="h-8 w-8" />
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">{t("stream.idle")}</h2>
          <p className="max-w-sm text-muted-foreground">{t("home.noStreamDesc")}</p>
        </div>
      </AppLayout>
    );
  }

  if (!s) {
    return (
      <AppLayout>
        <div className="h-[60vh] animate-pulse rounded-3xl bg-card/50" />
      </AppLayout>
    );
  }

  const qScore = { excellent: 96, good: 78, fair: 52, poor: 28 }[s.quality];

  return (
    <AppLayout>
      <Header title={t("stream.title")} subtitle={t("stream.subtitle")} state={s.state} label={stateLabel(s.state)} />

      {/* Hero status card */}
      <GlassCard glow className="relative mt-8 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-sm font-bold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" />
                {t("stream.active")}
              </span>
              {s.hdr && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background/50 px-3 py-1.5 text-sm font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("stream.hdr")}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full bg-background/50 px-3 py-1.5 text-sm font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> {t("stream.session")} {s.sessionDuration}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {s.resolution} <span className="text-primary">·</span> {s.fps} FPS
            </p>
            <p className="mt-1 text-muted-foreground">
              {s.codec} · {s.bitrateMbps} Mbps · {s.audio.channels}
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-destructive/90 px-6 py-3.5 font-bold text-destructive-foreground transition-all hover:bg-destructive">
            <Square className="h-4 w-4 fill-current" /> {t("stream.stop")}
          </button>
        </div>
      </GlassCard>

      {/* Core metrics */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Metric icon={MonitorPlay} accent label={t("stream.resolution")} value={s.resolution} />
        <Metric icon={Gauge} accent label={t("stream.fps")} value={`${s.fps}`} />
        <Metric icon={Radio} accent label={t("stream.bitrate")} value={`${s.bitrateMbps} Mbps`} />
        <Metric icon={Film} accent label={t("stream.codec")} value={s.codec} />
        <Metric icon={Signal} accent label={t("stream.latency")} value={`${s.latencyMs} ms`} />
        <Metric icon={Waves} accent label={t("stream.packetLoss")} value={`${s.packetLossPercent}%`} />
        <Metric icon={Sparkles} accent label={t("stream.hdr")} value={s.hdr ? t("stream.on") : t("stream.off")} />
        <Metric icon={Signal} accent label={t("stream.quality")} value={t(qualityKey(s.quality))} />
      </section>

      {/* Quality, Audio, Controller */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Connection quality */}
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-bold text-foreground">{t("stream.quality")}</h3>
          <div className="mt-5 space-y-4">
            <StatMeter label={t("stream.quality")} display={t(qualityKey(s.quality))} percent={qScore} icon={<Signal className="h-4 w-4" />} />
            <StatMeter label={t("stream.latency")} display={`${s.latencyMs} ms`} percent={100 - Math.min(100, s.latencyMs * 2)} icon={<Radio className="h-4 w-4" />} tone="cool" />
            <StatMeter label={t("stream.packetLoss")} display={`${s.packetLossPercent}%`} percent={100 - Math.min(100, s.packetLossPercent * 20)} icon={<Waves className="h-4 w-4" />} />
          </div>
        </GlassCard>

        {/* Audio status */}
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-bold text-foreground">{t("stream.audioStatus")}</h3>
          <div className="mt-5 flex items-center gap-4">
            <span
              className={cn(
                "grid h-14 w-14 shrink-0 place-items-center rounded-2xl",
                s.audio.enabled ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {s.audio.enabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </span>
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                {s.audio.enabled ? t("stream.audioOn") : t("stream.audioOff")}
              </p>
              <p className="text-sm text-muted-foreground">
                {s.audio.codec} · {s.audio.channels} · {s.audio.sampleRateKhz} kHz
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Controller status */}
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-bold text-foreground">{t("stream.controllerStatus")}</h3>
          <div className="mt-5 flex items-center gap-4">
            <span
              className={cn(
                "grid h-14 w-14 shrink-0 place-items-center rounded-2xl",
                s.controller.connected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              <Gamepad2 className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-foreground">
                {s.controller.connected ? s.controller.model : t("mypc.disconnected")}
              </p>
              {s.controller.connected && (
                <p className="text-sm text-muted-foreground">
                  {t("stream.player")} {s.controller.playerSlot}
                  {s.controller.batteryPercent !== null && ` · ${s.controller.batteryPercent}%`}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}

function Header({
  title,
  subtitle,
  state,
  label,
}: {
  title: string;
  subtitle: string;
  state: StreamingStatus["state"];
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3"
    >
      <div>
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
          state === "streaming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", state === "streaming" ? "bg-primary animate-pulse-ring" : "bg-muted-foreground")} />
        {label}
      </span>
    </motion.div>
  );
}
