import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Film,
  Gauge,
  Gamepad2,
  MonitorPlay,
  Play,
  Radio,
  RotateCcw,
  Signal,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { useI18n, type TKey } from "@/lib/i18n";
import { StreamingService } from "@/services";
import type { StreamState, StreamingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/streaming")({
  head: () => ({
    meta: [
      { title: "Streaming — Lave Play" },
      {
        name: "description",
        content:
          "Live cloud streaming session: game, status, resolution, FPS, codec, bitrate, HDR, audio and controller.",
      },
    ],
  }),
  component: StreamingPage,
});

type Action = "start" | "stop" | "restart";

function StreamingPage() {
  const { t } = useI18n();
  const [stream, setStream] = useState<StreamingStatus | null>(null);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  const refresh = async () => {
    const next = await StreamingService.getStatus();
    setStream(next);
  };

  useEffect(() => {
    void refresh();
    const off = StreamingService.subscribe(setStream);
    return off;
  }, []);

  const status = stream?.state ?? "preparing";
  const hasActiveGame = Boolean(stream?.gameName);
  const sunshineMissing = stream ? !stream.sunshineInstalled : false;

  const runAction = async (action: Action) => {
    setPendingAction(action);
    setStream((current) => current && { ...current, state: optimisticState(action) });

    try {
      if (action === "start") await StreamingService.start();
      if (action === "stop") await StreamingService.stop();
      if (action === "restart") await StreamingService.restart();
      await refresh();
    } catch {
      setStream((current) => current && { ...current, state: "error" });
    } finally {
      setPendingAction(null);
    }
  };

  if (!stream) {
    return (
      <AppLayout>
        <div className="h-[60vh] animate-pulse rounded-3xl bg-card/50" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header state={status} />

      {sunshineMissing && (
        <GlassCard className="mt-8 border-destructive/40 bg-destructive/10 p-5">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                {t("stream.sunshineMissing")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("stream.sunshineMissingDesc")}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard glow className="relative mt-8 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge state={status} />
              {stream.hdr && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background/50 px-3 py-1.5 text-sm font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("stream.hdr")}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("stream.gameName")}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {stream.gameName || t("stream.noActiveGame")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {stream.resolution} · {stream.fps} FPS · {stream.codec} · {stream.bitrateMbps} Mbps
            </p>
          </div>

          <ActionBar
            disabled={pendingAction !== null || sunshineMissing}
            pendingAction={pendingAction}
            onAction={runAction}
          />
        </div>
      </GlassCard>

      {!hasActiveGame ? (
        <EmptyState />
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Metric icon={MonitorPlay} label={t("stream.resolution")} value={stream.resolution} />
            <Metric icon={Gauge} label={t("stream.fps")} value={`${stream.fps}`} />
            <Metric icon={Film} label={t("stream.codec")} value={stream.codec} />
            <Metric icon={Radio} label={t("stream.bitrate")} value={`${stream.bitrateMbps} Mbps`} />
            <Metric
              icon={Sparkles}
              label={t("stream.hdr")}
              value={stream.hdr ? t("stream.on") : t("stream.off")}
            />
            <Metric
              icon={Volume2}
              label={t("stream.audio")}
              value={stream.audio.enabled ? t("stream.audioOn") : t("stream.audioOff")}
            />
            <Metric
              icon={Gamepad2}
              label={t("stream.controller")}
              value={stream.controller.connected ? stream.controller.model : t("mypc.disconnected")}
            />
            <Metric icon={Signal} label={t("stream.status")} value={t(statusKey(status))} />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <DetailCard
              icon={stream.audio.enabled ? Volume2 : VolumeX}
              title={t("stream.audioStatus")}
              primary={stream.audio.enabled ? t("stream.audioOn") : t("stream.audioOff")}
              secondary={`${stream.audio.codec} · ${stream.audio.channels} · ${stream.audio.sampleRateKhz} kHz`}
              active={stream.audio.enabled}
            />
            <DetailCard
              icon={Gamepad2}
              title={t("stream.controllerStatus")}
              primary={
                stream.controller.connected ? stream.controller.model : t("mypc.disconnected")
              }
              secondary={
                stream.controller.connected
                  ? `${t("stream.player")} ${stream.controller.playerSlot}`
                  : t("stream.controllerEmpty")
              }
              active={stream.controller.connected}
            />
          </section>
        </>
      )}
    </AppLayout>
  );
}

function Header({ state }: { state: StreamState }) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          <span className="text-gradient">{t("stream.title")}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{t("stream.subtitle")}</p>
      </div>
      <StatusBadge state={state} />
    </motion.div>
  );
}

function StatusBadge({ state }: { state: StreamState }) {
  const { t } = useI18n();
  const tone = statusTone(state);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
        tone.className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", tone.dotClassName)} />
      {t(statusKey(state))}
    </span>
  );
}

function ActionBar({
  disabled,
  pendingAction,
  onAction,
}: {
  disabled: boolean;
  pendingAction: Action | null;
  onAction: (action: Action) => void;
}) {
  const { t } = useI18n();
  const actions = useMemo(
    () => [
      {
        key: "start" as const,
        icon: Play,
        label: t("stream.startStream"),
        className: "bg-primary text-primary-foreground hover:bg-primary-glow",
      },
      {
        key: "stop" as const,
        icon: Square,
        label: t("stream.stopStream"),
        className: "bg-destructive/90 text-destructive-foreground hover:bg-destructive",
      },
      {
        key: "restart" as const,
        icon: RotateCcw,
        label: t("stream.restartStream"),
        className: "glass text-foreground hover:border-primary/50",
      },
    ],
    [t],
  );

  return (
    <div className="grid gap-2 sm:min-w-52">
      {actions.map((action) => (
        <button
          key={action.key}
          disabled={disabled}
          onClick={() => onAction(action.key)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] transition-all disabled:cursor-not-allowed disabled:opacity-50",
            action.className,
          )}
        >
          <action.icon className={cn("h-4 w-4", action.key !== "restart" && "fill-current")} />
          {pendingAction === action.key ? t("stream.working") : action.label}
        </button>
      ))}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <GlassCard hover className="p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 truncate font-display text-2xl font-bold text-foreground">{value}</p>
    </GlassCard>
  );
}

function DetailCard({
  icon: Icon,
  title,
  primary,
  secondary,
  active,
}: {
  icon: React.ElementType;
  title: string;
  primary: string;
  secondary: string;
  active: boolean;
}) {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <div className="mt-5 flex items-center gap-4">
        <span
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-2xl",
            active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold text-foreground">{primary}</p>
          <p className="truncate text-sm text-muted-foreground">{secondary}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-muted text-muted-foreground">
        <Signal className="h-8 w-8" />
      </span>
      <h2 className="font-display text-2xl font-bold text-foreground">
        {t("stream.noActiveGame")}
      </h2>
      <p className="max-w-sm text-muted-foreground">{t("stream.noActiveGameDesc")}</p>
    </div>
  );
}

function optimisticState(action: Action): StreamState {
  if (action === "stop") return "stopping";
  return "preparing";
}

function statusKey(state: StreamState): TKey {
  const keys: Record<StreamState, TKey> = {
    preparing: "stream.status.preparing",
    ready: "stream.status.ready",
    streaming: "stream.status.streaming",
    stopping: "stream.status.stopping",
    stopped: "stream.status.stopped",
    error: "stream.status.error",
    idle: "stream.status.stopped",
    connecting: "stream.status.preparing",
  };
  return keys[state];
}

function statusTone(state: StreamState) {
  if (state === "streaming") {
    return {
      className: "bg-primary/15 text-primary",
      dotClassName: "bg-primary animate-pulse-ring",
    };
  }

  if (state === "ready") {
    return {
      className: "bg-emerald-500/15 text-emerald-300",
      dotClassName: "bg-emerald-400",
    };
  }

  if (state === "preparing" || state === "connecting" || state === "stopping") {
    return {
      className: "bg-amber-500/15 text-amber-300",
      dotClassName: "bg-amber-300 animate-pulse-ring",
    };
  }

  if (state === "error") {
    return {
      className: "bg-destructive/15 text-destructive",
      dotClassName: "bg-destructive",
    };
  }

  return {
    className: "bg-muted text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  };
}
