import type { NetworkInfo, PcStatus, SystemInfo } from "@/lib/types";
import { agentConfig } from "./config";
import { apiClient, isAgentUnavailable } from "./apiClient";
import {
  offlineNetwork,
  offlineSystemInfo,
  toPcStatus,
  toSystemInfo,
  type AgentHealth,
  type AgentSession,
  type AgentSystem,
} from "./agentAdapter";

/**
 * SystemService — everything about the host gaming PC: specs, live usage,
 * temperatures and network. Backed by the Lave Agent REST API.
 */

export const SystemService = {
  /** Full system snapshot (specs + live metrics + network). */
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const [health, system, session] = await Promise.all([
        apiClient.get<AgentHealth>("/health"),
        apiClient.get<AgentSystem>("/system"),
        apiClient.get<AgentSession>("/session"),
      ]);
      return toSystemInfo(system, health, session);
    } catch (error) {
      if (isAgentUnavailable(error)) return offlineSystemInfo;
      throw error;
    }
  },

  /** Compact online + specs view for the status card. */
  async getStatus(): Promise<PcStatus> {
    const info = await this.getSystemInfo();
    return toPcStatus(info);
  },

  /** Network-only snapshot. */
  async getNetworkInfo(): Promise<NetworkInfo> {
    return (await this.getSystemInfo()).network ?? offlineNetwork;
  },

  /**
   * Live system telemetry. Calls `onData` on every update. Returns an
   * unsubscribe function.
   */
  subscribe(onData: (info: SystemInfo) => void): () => void {
    const id = setInterval(() => {
      void this.getSystemInfo().then(onData);
    }, agentConfig.pollIntervalMs);
    return () => clearInterval(id);
  },
};
