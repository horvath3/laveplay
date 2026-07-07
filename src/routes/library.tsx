import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search, RefreshCw, Plug } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GameCard } from "@/components/GameCard";
import { useI18n, type TKey } from "@/lib/i18n";
import { GameService } from "@/services";
import type { Game } from "@/lib/types";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Lave Play" },
      { name: "description", content: "All your games from Steam, Epic, Ubisoft, EA and local — in one library." },
    ],
  }),
  component: LibraryPage,
});

type Filter = "all" | "installed" | "favorites" | "recent";
type Sort = "recent" | "name" | "playtime" | "size" | "rating";

function LibraryPage() {
  const { t } = useI18n();
  const [games, setGames] = useState<Game[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  useEffect(() => {
    GameService.list().then(setGames);
  }, []);

  const toggleFavorite = async (id: string) => {
    await GameService.toggleFavorite(id);
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g)));
  };

  const filtered = useMemo(() => {
    let list = [...games];
    if (filter === "installed") list = list.filter((g) => g.installed);
    if (filter === "favorites") list = list.filter((g) => g.favorite);
    if (filter === "recent") list = list.filter((g) => g.lastPlayed);
    if (query) list = list.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()));

    const byRecent = (a: Game, b: Game) =>
      (b.lastPlayed ?? "") > (a.lastPlayed ?? "") ? 1 : -1;
    if (sort === "recent") list.sort(byRecent);
    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "playtime") list.sort((a, b) => b.playTimeMinutes - a.playTimeMinutes);
    if (sort === "size") list.sort((a, b) => b.installedSizeGb - a.installedSizeGb);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [games, filter, query, sort]);


  const filters: { key: Filter; label: TKey }[] = [
    { key: "all", label: "lib.all" },
    { key: "installed", label: "lib.installed" },
    { key: "favorites", label: "lib.favorites" },
    { key: "recent", label: "lib.recent" },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            <span className="text-gradient">{t("lib.title")}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">{t("lib.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50">
            <RefreshCw className="h-4 w-4 text-primary" /> {t("lib.syncSteam")}
          </button>
          <button className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50">
            <Plug className="h-4 w-4 text-primary" /> {t("lib.storeConnect")}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                "rounded-xl px-4 py-2 text-sm font-semibold transition-all " +
                (filter === f.key
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_oklch(0.73_0.19_129/0.6)]"
                  : "glass text-muted-foreground hover:text-foreground")
              }
            >
              {t(f.label)}
            </button>
          ))}
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 md:w-64">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("lib.search")}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
            <ArrowDownWideNarrow className="h-4 w-4 shrink-0 text-primary" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent text-sm font-medium text-foreground outline-none [&>option]:bg-popover"
            >
              <option value="recent">{t("lib.sortRecent")}</option>
              <option value="name">{t("lib.sortName")}</option>
              <option value="playtime">{t("lib.sortPlaytime")}</option>
              <option value="size">{t("lib.sortSize")}</option>
              <option value="rating">{t("lib.sortRating")}</option>
            </select>
          </div>
        </div>
      </div>


      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {filtered.map((g) => (
          <GameCard key={g.id} game={g} onToggleFavorite={toggleFavorite} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">No games found.</p>
      )}
    </AppLayout>
  );
}
