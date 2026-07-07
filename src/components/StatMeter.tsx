import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StatMeterProps {
  label: string;
  /** displayed value, e.g. "58%", "67°C" */
  display: string;
  /** 0-100 fill percentage */
  percent: number;
  icon?: React.ReactNode;
  tone?: "primary" | "warning" | "cool";
}

const tones: Record<string, string> = {
  primary: "from-primary to-primary-glow",
  warning: "from-warning to-primary-glow",
  cool: "from-[oklch(0.7_0.15_200)] to-primary",
};

export function StatMeter({ label, display, percent, icon, tone = "primary" }: StatMeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          {icon && <span className="shrink-0 text-primary">{icon}</span>}
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 font-mono text-sm font-semibold text-foreground">{display}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", tones[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
