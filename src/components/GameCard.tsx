import { motion } from "motion/react";
import { Play, Download, Heart, Check, Clock } from "lucide-react";
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

function playTime(min: number): string {
  const h = Math.floor(min / 60);
  return h > 0 ? `${h}h` : `${min}m`;
}

export function GameCard({
  game,
  onToggleFavorite,
}: {
  game: Game;
  onToggleFavorite?: (id: string) => void;
}) {
  const { t } = useI18n();

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      className="group glass relative overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_28px_70px_-24px_oklch(0.73_0.19_129/0.45)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          width={600}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold text-foreground/90">
            {storeLabels[game.store]}
          </span>
          <div className="flex gap-1.5">
            {game.installed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                <Check className="h-3 w-3" /> {t("lib.installed")}
              </span>
            )}
            <button
              onClick={() => onToggleFavorite?.(game.id)}
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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="animate-pulse-ring grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_oklch(0.73_0.19_129/0.6)] transition-transform hover:scale-105">
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-foreground">{game.title}</h3>
            <p className="text-xs text-muted-foreground">{game.genre}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            {relativeTime(game.lastPlayed, t("lib.never"))}
          </span>
          <span className="text-right font-mono">{playTime(game.playTimeMinutes)}</span>
          <span>{t("lib.size")}</span>
          <span className="text-right font-mono">{game.installedSizeGb.toFixed(1)} GB</span>
        </div>

        <button
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all",
            game.installed
              ? "bg-primary text-primary-foreground hover:bg-primary-glow hover:shadow-[0_0_24px_oklch(0.73_0.19_129/0.5)]"
              : "glass text-foreground hover:border-primary/50",
          )}
        >
          {game.installed ? (
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
