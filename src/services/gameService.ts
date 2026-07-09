import type { Game } from "@/lib/types";
import { apiClient, isAgentUnavailable } from "./apiClient";
import type { AgentGame } from "./agentAdapter";
import { toGame } from "./agentAdapter";

/**
 * GameService — the game library: listing, filtering, favorites, launching and
 * store syncing. Reads come from the Lave Agent; UI-only mutations stay local
 * until the Agent exposes write endpoints for them.
 */

let library: Game[] = [];
const favoriteOverrides = new Map<string, boolean>();

export const GameService = {
  /** All games across every connected store. */
  async list(): Promise<Game[]> {
    try {
      const games = await apiClient.get<AgentGame[]>("/games");
      library = games.map((game) => {
        const mapped = toGame(game);
        return favoriteOverrides.has(mapped.id)
          ? { ...mapped, favorite: favoriteOverrides.get(mapped.id)! }
          : mapped;
      });
      return library.map((g) => ({ ...g }));
    } catch (error) {
      if (isAgentUnavailable(error)) return [];
      throw error;
    }
  },

  /** A single game by id. */
  async get(id: string): Promise<Game | undefined> {
    const games = library.length ? library : await this.list();
    return games.find((g) => g.id === id);
  },

  /** Toggle favorite state; returns the updated game. */
  async toggleFavorite(id: string): Promise<Game | undefined> {
    library = library.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g));
    const updated = library.find((g) => g.id === id);
    if (updated) favoriteOverrides.set(id, updated.favorite);
    return updated;
  },

  /** Launch a game on the host PC and start streaming. */
  async launch(id: string): Promise<{ started: boolean }> {
    const session = await apiClient.post<{ status: string }>(`/session/start/${encodeURIComponent(id)}`);
    return { started: session.status?.toLowerCase() === "running" };
  },

  /** Re-scan connected stores (Steam, Epic, ...) for installed titles. */
  async sync(): Promise<Game[]> {
    return this.list();
  },
};
