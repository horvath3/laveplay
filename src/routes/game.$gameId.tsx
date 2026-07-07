import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Play,
  Download,
  ArrowLeft,
  Trophy,
  Clock,
  HardDrive,
  CalendarDays,
  Gamepad2,
  MonitorPlay,
  Star,
  Building2,
  Heart,
  Check,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { useI18n } from "@/lib/i18n";
import { GameService, storeLabels } from "@/services";
import type { Game } from "@/lib/types";
import { relativeTime, playTime, controllerKey, compatKey } from "@/lib/format";

export const Route = createFileRoute("/game/$gameId")({
  head: () => ({
    meta: [
      { title: "Game Details — Lave Play" },
      { name: "description", content: "Game details, achievements, play time and streaming compatibility." },
    ],
  }),
  component: GameDetailsPage,
});

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <GlassCard hover className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-lg font-bold text-foreground">{value}</p>
    </GlassCard>
  );
}

function GameDetailsPage() {
  const { gameId } = Route.useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null | undefined>(undefined);

  useEffect(() => {
    GameService.get(gameId).then((g) => setGame(g ?? null));
  }, [gameId]);

  // Not found
  if (game === null) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-muted text-muted-foreground">
            <Gamepad2 className="h-7 w-7" />
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("game.notFound")}</h1>
          <p className="text-muted-foreground">{t("game.notFoundDesc")}</p>
          <Link
            to="/library"
            className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground transition-all hover:bg-primary-glow"
          >
            <ArrowLeft className="h-4 w-4" /> {t("game.back")}
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (game === undefined) {
    return (
      <AppLayout>
        <div className="h-[60vh] animate-pulse rounded-3xl bg-card/50" />
      </AppLayout>
    );
  }

  const achPct = game.achievements.total
    ? Math.round((game.achievements.unlocked / game.achievements.total) * 100)
    : 0;

  return (
    <AppLayout>
      {/* Background artwork */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img src={game.cover} alt="" className="h-full w-full object-cover opacity-15 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
      </div>

      <button
        onClick={() => navigate({ to: "/library" })}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {t("game.back")}
      </button>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Large cover */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="glass overflow-hidden rounded-3xl">
            <div className="relative aspect-[3/4]">
              <img src={game.cover} alt={game.title} className="h-full w-full object-cover" />
              {game.installed && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                  <Check className="h-3 w-3" /> {t("lib.installed")}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              <button className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary-glow hover:shadow-[0_0_24px_oklch(0.73_0.19_129/0.5)]">
                {game.installed ? (
                  <>
                    <Play className="h-4 w-4 fill-current" /> {t("game.play")}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> {t("game.install")}
                  </>
                )}
              </button>
              <Link
                to="/streaming"
                className="glass flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                <MonitorPlay className="h-4 w-4 text-primary" /> {t("game.stream")}
              </Link>
              <button className="glass flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50">
                <Heart className={"h-4 w-4 " + (game.favorite ? "fill-primary text-primary" : "text-primary")} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="glass inline-flex rounded-full px-3 py-1 text-xs font-semibold text-foreground/90">
            {storeLabels[game.store]}
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            <span className="text-gradient">{game.title}</span>
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{game.genre}</span>
            <span className="text-primary">•</span>
            <span>{game.releaseYear}</span>
            <span className="text-primary">•</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {game.rating}/100
            </span>
          </p>

          {/* About */}
          <section className="mt-8">
            <h2 className="mb-2 font-display text-xl font-bold text-foreground">{t("game.about")}</h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">{game.description}</p>
          </section>

          {/* Key stats */}
          <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatTile icon={Clock} label={t("game.playTime")} value={playTime(game.playTimeMinutes)} />
            <StatTile icon={HardDrive} label={t("game.size")} value={`${game.installedSizeGb.toFixed(1)} GB`} />
            <StatTile icon={CalendarDays} label={t("game.lastPlayed")} value={relativeTime(game.lastPlayed, t("lib.never"))} />
            <StatTile icon={Gamepad2} label={t("game.controller")} value={t(controllerKey(game.controllerSupport))} />
            <StatTile icon={MonitorPlay} label={t("game.compat")} value={t(compatKey(game.streamingCompat))} />
            <StatTile icon={Building2} label={t("game.developer")} value={game.developer} />
          </section>

          {/* Achievements placeholder */}
          <section className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <Trophy className="h-5 w-5 text-primary" /> {t("game.achievements")}
            </h2>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {game.achievements.unlocked}/{game.achievements.total} {t("game.unlocked")}
                </span>
                <span className="font-mono font-semibold text-foreground">{achPct}%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${achPct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={
                      "grid aspect-square place-items-center rounded-xl " +
                      (i < Math.round((game.achievements.unlocked / Math.max(1, game.achievements.total)) * 8)
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground/40")
                    }
                  >
                    <Trophy className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">{t("game.achievementsSoon")}</p>
            </GlassCard>
          </section>

          {/* Publisher meta */}
          <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatTile icon={Building2} label={t("game.publisher")} value={game.publisher} />
            <StatTile icon={CalendarDays} label={t("game.released")} value={`${game.releaseYear}`} />
            <StatTile icon={Star} label={t("game.rating")} value={`${game.rating}/100`} />
          </section>
        </motion.div>
      </div>
    </AppLayout>
  );
}
