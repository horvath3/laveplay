import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Cpu,
  MonitorPlay,
  MemoryStick,
  Thermometer,
  Fan,
  BatteryCharging,
  Gamepad2,
  Clock,
  Wifi,
  ArrowDownToLine,
  ArrowUpFromLine,
  Radio,
  Gauge,
  Film,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { StatMeter } from "@/components/StatMeter";
import { useI18n } from "@/lib/i18n";
import { SystemService, StreamingService } from "@/services";
import type { StreamingStatus, SystemInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-pc")({
  head: () => ({
    meta: [
      { title: "My PC — Lave Play" },
      {
        name: "description",
        content:
          "Live system telemetry from your gaming PC: usage, temperatures, network and streaming stats.",
      },
    ],
  }),
  component: MyPcPage,
});

function InfoTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn("h-4 w-4", accent ? "text-primary" : "text-muted-foreground")} />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </GlassCard>
  );
}

function MyPcPage() {
  const { t } = useI18n();
  const [sys, setSys] = useState<SystemInfo | null>(null);
  const [stream, setStream] = useState<StreamingStatus | null>(null);

  // Live telemetry subscriptions (mock now, Lave Agent WebSocket later).
  useEffect(() => {
    SystemService.getSystemInfo().then(setSys);
    StreamingService.getStatus().then(setStream);
    const offSys = SystemService.subscribe(setSys);
    const offStream = StreamingService.subscribe(setStream);
    return () => {
      offSys();
      offStream();
    };
  }, []);

  if (!sys || !stream) return null;

  const tel = sys;
  const net = sys.network;
  const streamStatus = stream;

  const qualityLabel = net.quality === "excellent" ? t("common.excellent") : t("common.good");

  return (
    <AppLayout>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            <span className="text-gradient">{t("mypc.title")}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">{t("mypc.subtitle")}</p>
        </div>
        <span
          className={cn(
            "glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
            tel.online ? "text-primary" : "text-destructive",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              tel.online ? "bg-primary animate-pulse-ring" : "bg-destructive",
            )}
          />
          {tel.online ? t("pc.online") : t("pc.offline")}
        </span>
      </div>

      {/* Performance */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold">{t("mypc.performance")}</h2>
        <GlassCard className="grid gap-6 p-6 md:grid-cols-3">
          <StatMeter
            label={t("mypc.cpuUsage")}
            display={`${tel.cpuUsage}%`}
            percent={tel.cpuUsage}
            icon={<Cpu className="h-4 w-4" />}
          />
          <StatMeter
            label={t("mypc.gpuUsage")}
            display={`${tel.gpuUsage}%`}
            percent={tel.gpuUsage}
            icon={<MonitorPlay className="h-4 w-4" />}
            tone="cool"
          />
          <StatMeter
            label={t("mypc.ramUsage")}
            display={`${tel.ramUsage}%`}
            percent={tel.ramUsage}
            icon={<MemoryStick className="h-4 w-4" />}
          />
        </GlassCard>
      </section>

      {/* Temperatures & system */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">{t("mypc.temps")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoTile
              icon={Thermometer}
              accent
              label={t("mypc.cpuTemp")}
              value={`${tel.cpuTempC}°C`}
            />
            <InfoTile
              icon={Thermometer}
              accent
              label={t("mypc.gpuTemp")}
              value={`${tel.gpuTempC}°C`}
            />
            <InfoTile icon={Fan} accent label={t("mypc.fan")} value={`${tel.fanRpm} RPM`} />
            <InfoTile
              icon={BatteryCharging}
              accent
              label={t("mypc.battery")}
              value={tel.batteryPercent === null ? "AC" : `${tel.batteryPercent}%`}
              sub={
                tel.batteryPercent === null
                  ? "Desktop"
                  : tel.batteryCharging
                    ? "Charging"
                    : "On battery"
              }
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-bold">{t("mypc.system")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoTile
              icon={Gamepad2}
              accent
              label={t("mypc.runningGame")}
              value={tel.currentGame ?? t("mypc.idle")}
            />
            <InfoTile icon={Clock} accent label={t("mypc.uptime")} value={tel.uptime} />
            <InfoTile
              icon={ArrowDownToLine}
              accent
              label={t("mypc.download")}
              value={`${net.downloadMbps}`}
              sub="Mbps"
            />
            <InfoTile
              icon={ArrowUpFromLine}
              accent
              label={t("mypc.upload")}
              value={`${net.uploadMbps}`}
              sub="Mbps"
            />
          </div>
        </section>
      </div>

      {/* Network */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold">{t("mypc.network")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <InfoTile icon={Radio} accent label={t("mypc.latency")} value={`${net.latencyMs} ms`} />
          <InfoTile
            icon={ArrowDownToLine}
            accent
            label={t("mypc.download")}
            value={`${net.downloadMbps} Mbps`}
          />
          <InfoTile
            icon={ArrowUpFromLine}
            accent
            label={t("mypc.upload")}
            value={`${net.uploadMbps} Mbps`}
          />
          <InfoTile icon={Wifi} accent label={t("mypc.quality")} value={qualityLabel} />
        </div>
      </section>

      {/* Streaming */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold">{t("mypc.streaming")}</h2>
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <Film className="h-5 w-5 text-primary" /> {t("mypc.streamStatus")}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
                streamStatus.state === "streaming"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  streamStatus.state === "streaming"
                    ? "bg-primary animate-pulse-ring"
                    : "bg-muted-foreground",
                )}
              />
              {streamStatus.state === "streaming" ? t("mypc.streaming.active") : t("stream.idle")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoTile
              icon={MonitorPlay}
              label={t("mypc.resolution")}
              value={streamStatus.resolution}
            />
            <InfoTile icon={Gauge} label={t("mypc.fps")} value={`${streamStatus.fps}`} />
            <InfoTile
              icon={Radio}
              label={t("mypc.bitrate")}
              value={`${streamStatus.bitrateMbps} Mbps`}
            />
            <InfoTile icon={Film} label={t("mypc.codec")} value={streamStatus.codec} />
            <InfoTile icon={Wifi} label={t("mypc.quality")} value={qualityLabel} />
            <InfoTile
              icon={Radio}
              label={t("mypc.latency")}
              value={`${streamStatus.latencyMs} ms`}
            />
            <InfoTile
              icon={ArrowDownToLine}
              label={t("mypc.packetLoss")}
              value={`${streamStatus.packetLossPercent}%`}
            />
            <InfoTile
              icon={Gamepad2}
              accent
              label={t("mypc.controller")}
              value={
                streamStatus.controller.connected ? t("mypc.connected") : t("mypc.disconnected")
              }
            />
          </div>
        </GlassCard>
      </section>
    </AppLayout>
  );
}
