import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Play, Download, Heart, Check, Clock, HardDrive, Layers3, Loader2 } from "lucide-react";
import type { Game } from "@/lib/types";
import { storeLabels } from "@/services";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function relativeTime(iso: string | null, neverLabel: string): string {
  if (!iso) return neverLabel;
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.round(diff / 3600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function launcherMark(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function GameCard({
  game,
  onToggleFavorite,
  onPlay,
  launching,
}: {
  game: Game;
  onToggleFavorite?: (id: string) => void;
  onPlay?: (id: string) => void;
  launching?: boolean;
}) {
  const { t } = useI18n();
  const launcherLabel = game.launcher || storeLabels[game.store];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      className="group glass relative overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_28px_70px_-24px_oklch(0.73_0.19_129/0.45)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {game.cover ? (
          <img
            src={game.cover}
            alt={game.title}
            loading="lazy"
            width={600}
            height={800}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_18%,oklch(0.73_0.19_129/0.24),transparent_42%),linear-gradient(145deg,oklch(0.24_0.02_240),oklch(0.15_0.012_240))] px-5 text-center">
            <Layers3 className="h-12 w-12 text-primary/80" />
            <span className="line-clamp-3 font-display text-lg font-extrabold text-foreground">{game.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-foreground/90">
            {game.icon ? (
              <img src={game.icon} alt="" className="h-4 w-4 rounded object-cover" />
            ) : (
              <span className="grid h-4 w-4 place-items-center rounded bg-primary/20 text-[9px] font-black text-primary">
                {launcherMark(launcherLabel)}
              </span>
            )}
            {launcherLabel}
          </span>
          <div className="flex gap-1.5">
            {game.installed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                <Check className="h-3 w-3" /> {t("lib.installed")}
              </span>
            )}
            <button
              onClick={(event) => {
                event.preventDefault();
                onToggleFavorite?.(game.id);
              }}
              aria-label="favorite"
              className="glass grid h-7 w-7 place-items-center rounded-full transition-colors hover:border-primary/50"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  game.favorite ? "fill-primary text-primary" : "text-foreground/70",
                )}
              />
            </button>
          </div>
        </div>

        {/* Hover play overlay */}
        <Link
          to="/game/$gameId"
          params={{ gameId: game.id }}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="animate-pulse-ring grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_oklch(0.73_0.19_129/0.6)] transition-transform hover:scale-105">
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </span>
        </Link>
      </div>


      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to="/game/$gameId" params={{ gameId: game.id }} className="block">
              <h3 className="truncate font-display text-base font-bold text-foreground transition-colors hover:text-primary">{game.title}</h3>
            </Link>
            <p className="truncate text-xs text-muted-foreground">{launcherLabel}</p>
          </div>

        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            {relativeTime(game.lastPlayed, t("lib.never"))}
          </span>
          <span className="truncate text-right font-mono">{game.version || "v - "}</span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-primary" />
            {t("lib.size")}
          </span>
          <span className="text-right font-mono">{game.installedSizeGb.toFixed(1)} GB</span>
        </div>

        <button
          onClick={() => game.installed && !launching && onPlay?.(game.id)}
          disabled={!game.installed || launching}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all",
            game.installed
              ? "bg-primary text-primary-foreground hover:bg-primary-glow hover:shadow-[0_0_24px_oklch(0.73_0.19_129/0.5)]"
              : "glass text-foreground hover:border-primary/50",
            (!game.installed || launching) && "cursor-not-allowed opacity-70",
          )}
        >
          {launching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> STARTING
            </>
          ) : game.installed ? (
            <>
              <Play className="h-4 w-4 fill-current" /> {t("lib.play")}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> {t("lib.install")}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
