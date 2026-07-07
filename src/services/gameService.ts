import { games as mockGames } from "@/data/mock";
import type { Game } from "@/lib/types";
import { agentConfig } from "./config";
import { apiClient, mockDelay } from "./apiClient";

/**
 * GameService — the game library: listing, filtering, favorites, launching and
 * store syncing. Mutations update an in-memory copy today; the same methods
 * will POST to the Lave Agent once it's connected.
 */

// Local working copy so favorite toggles persist within a session (mock mode).
let library: Game[] = mockGames.map((g) => ({ ...g }));

export const GameService = {
  /** All games across every connected store. */
  async list(): Promise<Game[]> {
    if (agentConfig.useMock) return mockDelay(library.map((g) => ({ ...g })));
    return apiClient.get<Game[]>("/games");
  },

  /** A single game by id. */
  async get(id: string): Promise<Game | undefined> {
    if (agentConfig.useMock) return mockDelay(library.find((g) => g.id === id));
    return apiClient.get<Game>(`/games/${id}`);
  },

  /** Toggle favorite state; returns the updated game. */
  async toggleFavorite(id: string): Promise<Game | undefined> {
    if (agentConfig.useMock) {
      library = library.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g));
      return mockDelay(library.find((g) => g.id === id));
    }
    return apiClient.post<Game>(`/games/${id}/favorite`);
  },

  /** Launch a game on the host PC and start streaming. */
  async launch(id: string): Promise<{ started: boolean }> {
    if (agentConfig.useMock) return mockDelay({ started: true });
    return apiClient.post<{ started: boolean }>(`/games/${id}/launch`);
  },

  /** Re-scan connected stores (Steam, Epic, ...) for installed titles. */
  async sync(): Promise<Game[]> {
    if (agentConfig.useMock) return this.list();
    return apiClient.post<Game[]>("/games/sync");
  },
};
