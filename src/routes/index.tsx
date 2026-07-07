import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play, Library as LibraryIcon, Zap, HardDriveDownload, RefreshCw, Power, Sparkles, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { PcStatusCard } from "@/components/PcStatusCard";
import { GlassCard } from "@/components/GlassCard";
import { ActiveStreamCard, ConnectionQualityCard } from "@/components/StreamCards";
import { useI18n, type TKey } from "@/lib/i18n";
import { GameService, SystemService, StreamingService } from "@/services";
import type { Game, PcStatus, StreamingStatus } from "@/lib/types";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lave Play — Play Your Own PC Anywhere" },
      {
        name: "description",
        content: "Turn your gaming PC into your own cloud gaming server. Stream your games from anywhere.",
      },
    ],
  }),
  component: Home,
});

function GameRow({
  title,
  items,
  emptyDesc,
}: {
  title: string;
  items: Game[];
  emptyDesc?: TKey;
}) {
  const { t } = useI18n();
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
        <Link
          to="/library"
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          {t("home.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <GlassCard className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <LibraryIcon className="h-5 w-5" />
          </span>
          <p className="font-semibold text-foreground">{t("home.emptyRow")}</p>
          {emptyDesc && <p className="text-sm text-muted-foreground">{t(emptyDesc)}</p>}
        </GlassCard>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((g) => (
            <motion.div key={g.id} whileHover={{ y: -6 }} className="w-40 shrink-0 sm:w-48">
              <Link
                to="/game/$gameId"
                params={{ gameId: g.id }}
                className="group glass relative block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_24px_60px_-24px_oklch(0.73_0.19_129/0.5)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={g.cover}
                    alt={g.title}
                    loading="lazy"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_oklch(0.73_0.19_129/0.6)]">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="truncate text-sm font-bold text-foreground">{g.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{g.genre}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Home() {
  const { t } = useI18n();
  const [games, setGames] = useState<Game[]>([]);
  const [status, setStatus] = useState<PcStatus | null>(null);
  const [stream, setStream] = useState<StreamingStatus | null>(null);

  useEffect(() => {
    GameService.list().then(setGames);
    SystemService.getStatus().then(setStatus);
    StreamingService.getStatus().then(setStream);
    const off = StreamingService.subscribe(setStream);
    return off;
  }, []);

  const continuePlaying = [...games]
    .filter((g) => g.lastPlayed)
    .sort((a, b) => (b.lastPlayed! > a.lastPlayed! ? 1 : -1))
    .slice(0, 6);
  const recentlyAdded = [...games]
    .sort((a, b) => (b.addedAt > a.addedAt ? 1 : -1))
    .slice(0, 6);
  const favorites = games.filter((g) => g.favorite);
  const recommended = [...games].filter((g) => g.recommended).sort((a, b) => b.rating - a.rating);
  const quickLaunch = games.filter((g) => g.installed).slice(0, 4);

  const actions = [
    { icon: Power, title: t("home.wake"), desc: t("home.wakeDesc") },
    { icon: RefreshCw, title: t("home.update"), desc: t("home.updateDesc") },
    { icon: HardDriveDownload, title: t("home.optimize"), desc: t("home.optimizeDesc") },
  ];

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-primary"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" />
              {status?.online === false ? t("pc.offline") : t("pc.online")} · {t("pc.status")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              <span className="text-gradient">{t("hero.title")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-lg text-lg text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button className="group flex items-center gap-3 rounded-2xl bg-primary px-7 py-4 text-lg font-bold text-primary-foreground shadow-[0_0_40px_-6px_oklch(0.73_0.19_129/0.7)] transition-all hover:scale-[1.03] hover:bg-primary-glow">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/20">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </span>
                {t("hero.play")}
              </button>
              <Link
                to="/library"
                className="glass flex items-center gap-2 rounded-2xl px-6 py-4 text-lg font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                <LibraryIcon className="h-5 w-5" />
                {t("hero.viewLibrary")}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="justify-self-center lg:justify-self-end"
          >
            {status && <PcStatusCard status={status} />}
          </motion.div>
        </div>
      </section>

      {/* Live stream + connection */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <ActiveStreamCard stream={stream} />
        <ConnectionQualityCard stream={stream} />
      </section>

      {/* Quick launch */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-foreground">{t("home.quickLaunch")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {quickLaunch.map((g) => (
            <Link
              key={g.id}
              to="/game/$gameId"
              params={{ gameId: g.id }}
              className="group glass flex items-center gap-3 rounded-2xl p-3 text-left transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <img
                src={g.cover}
                alt={g.title}
                loading="lazy"
                width={600}
                height={800}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{g.title}</p>
                <p className="truncate text-xs text-muted-foreground">{g.genre}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <GameRow title={t("home.continue")} items={continuePlaying} emptyDesc="home.emptyContinue" />
      <GameRow title={t("home.favorites")} items={favorites} emptyDesc="home.emptyFav" />
      <GameRow title={t("home.recent")} items={recentlyAdded} />

      {/* Recommended */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">{t("home.recommended")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recommended.map((g) => (
            <motion.div key={g.id} whileHover={{ y: -6 }}>
              <Link
                to="/game/$gameId"
                params={{ gameId: g.id }}
                className="group glass relative block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_24px_60px_-24px_oklch(0.73_0.19_129/0.5)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={g.cover}
                    alt={g.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                    {g.rating}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="truncate font-bold text-foreground">{g.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{g.genre}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended actions */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-foreground">{t("home.actions")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((a) => (
            <GlassCard key={a.title} hover className="flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <a.icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-foreground">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
              <Zap className="ml-auto h-5 w-5 shrink-0 text-primary" />
            </GlassCard>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
