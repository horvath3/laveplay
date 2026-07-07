import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Moon,
  Languages,
  Gamepad2,
  Power,
  MoonStar,
  PowerOff,
  Rocket,
  RefreshCw,
  Bell,
  Monitor,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { useI18n, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lave Play" },
      { name: "description", content: "Configure streaming quality, resolution, controller support and PC automation." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-background shadow transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function Row({
  icon: Icon,
  title,
  desc,
  children,
  soon,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  children: React.ReactNode;
  soon?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <span className="truncate">{title}</span>
            {soon && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                soon
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SegmentGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="glass inline-flex rounded-xl p-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
            value === o.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPage() {
  const { t, lang, setLang } = useI18n();

  const [darkMode, setDarkMode] = useState(true);
  const [controller, setController] = useState(true);
  const [quality, setQuality] = useState<"balanced" | "performance" | "quality">("balanced");
  const [resolution, setResolution] = useState<"720p" | "1080p" | "1440p" | "4k">("1080p");

  // Future automation options (visual only for now).
  const [automation, setAutomation] = useState({
    wol: true,
    autoSleep: false,
    autoShutdown: false,
    autoSteam: true,
    autoReconnect: true,
    notifications: true,
  });
  const flip = (k: keyof typeof automation) =>
    setAutomation((p) => ({ ...p, [k]: !p[k] }));

  const automationRows: {
    k: keyof typeof automation;
    icon: React.ElementType;
    title: TKey;
    desc: TKey;
  }[] = [
    { k: "wol", icon: Power, title: "set.wol", desc: "set.wolDesc" },
    { k: "autoSleep", icon: MoonStar, title: "set.autoSleep", desc: "set.autoSleepDesc" },
    { k: "autoShutdown", icon: PowerOff, title: "set.autoShutdown", desc: "set.autoShutdownDesc" },
    { k: "autoSteam", icon: Rocket, title: "set.autoSteam", desc: "set.autoSteamDesc" },
    { k: "autoReconnect", icon: RefreshCw, title: "set.autoReconnect", desc: "set.autoReconnectDesc" },
    { k: "notifications", icon: Bell, title: "set.notifications", desc: "set.notifDesc" },
  ];

  return (
    <AppLayout>
      <h1 className="text-4xl font-extrabold sm:text-5xl">
        <span className="text-gradient">{t("set.title")}</span>
      </h1>
      <p className="mt-2 text-muted-foreground">{t("set.subtitle")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">{t("set.appearance")}</h2>
          <div className="mt-2 divide-y divide-border">
            <Row icon={Moon} title={t("set.darkMode")} desc={t("set.darkModeDesc")}>
              <Toggle on={darkMode} onClick={() => setDarkMode((v) => !v)} />
            </Row>
            <Row icon={Languages} title={t("set.language")} desc={t("set.languageDesc")}>
              <SegmentGroup
                value={lang}
                onChange={setLang}
                options={[
                  { key: "en", label: "EN" },
                  { key: "hu", label: "HU" },
                ]}
              />
            </Row>
          </div>
        </GlassCard>

        {/* Streaming */}
        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-bold">{t("set.stream")}</h2>
          <div className="mt-2 divide-y divide-border">
            <Row icon={Monitor} title={t("set.streamQuality")} desc={t("set.subtitle")}>
              <SegmentGroup
                value={quality}
                onChange={setQuality}
                options={[
                  { key: "balanced", label: t("set.balanced") },
                  { key: "performance", label: t("set.performance") },
                  { key: "quality", label: t("set.quality") },
                ]}
              />
            </Row>
            <Row icon={Monitor} title={t("set.resolution")} desc="720p – 4K">
              <SegmentGroup
                value={resolution}
                onChange={setResolution}
                options={[
                  { key: "720p", label: "720p" },
                  { key: "1080p", label: "1080p" },
                  { key: "1440p", label: "1440p" },
                  { key: "4k", label: "4K" },
                ]}
              />
            </Row>
            <Row icon={Gamepad2} title={t("set.controllerSupport")} desc={t("set.controllerDesc")}>
              <Toggle on={controller} onClick={() => setController((v) => !v)} />
            </Row>
          </div>
        </GlassCard>

        {/* Automation */}
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">{t("set.automation")}</h2>
          <div className="mt-2 grid gap-x-8 md:grid-cols-2">
            {automationRows.map((r) => (
              <div key={r.k} className="border-b border-border">
                <Row icon={r.icon} title={t(r.title)} desc={t(r.desc)} soon>
                  <Toggle on={automation[r.k]} onClick={() => flip(r.k)} />
                </Row>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
