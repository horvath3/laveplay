import { Cpu, MonitorPlay, MemoryStick, HardDrive, Wifi, Zap } from "lucide-react";
import type { PcStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

export function PcStatusCard({ status }: { status: PcStatus }) {
  const { t } = useI18n();

  const rows = [
    { icon: Cpu, label: t("pc.cpu"), value: status.specs.cpu },
    { icon: MonitorPlay, label: t("pc.gpu"), value: status.specs.gpu },
    { icon: MemoryStick, label: t("pc.ram"), value: `${status.specs.ramGb} GB DDR5` },
    { icon: HardDrive, label: t("pc.storage"), value: status.specs.storage },
    { icon: Wifi, label: t("pc.internet"), value: status.specs.internet },
  ];

  return (
    <GlassCard glow className="w-full max-w-md p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">{t("pc.status")}</h3>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
            status.online
              ? "bg-primary/15 text-primary"
              : "bg-destructive/15 text-destructive",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status.online ? "bg-primary animate-pulse-ring" : "bg-destructive",
            )}
          />
          {status.online ? t("pc.online") : t("pc.offline")}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <span className="truncate">{r.label}</span>
            </span>
            <span className="truncate text-right text-sm font-semibold text-foreground">{r.value}</span>
          </div>
        ))}
      </div>

      <button
        disabled={!status.online}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary-glow hover:shadow-[0_0_24px_oklch(0.73_0.19_129/0.5)] disabled:opacity-50"
      >
        <Zap className="h-4 w-4 fill-current" /> {t("pc.connect")}
      </button>
    </GlassCard>
  );
}
