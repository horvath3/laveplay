import { networkInfo, systemInfo } from "@/data/mock";
import type { NetworkInfo, PcStatus, SystemInfo } from "@/lib/types";
import { agentConfig } from "./config";
import { apiClient, mockDelay } from "./apiClient";
import { websocketService } from "./websocketService";

/**
 * SystemService — everything about the host gaming PC: specs, live usage,
 * temperatures and network. Backed by mock data today; swap to the Lave Agent
 * by setting `useMock` to false in config (endpoints already wired below).
 */

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const drift = (base: number, spread: number, min = 0, max = 100) =>
  clamp(Math.round(base + (Math.random() - 0.5) * spread), min, max);

/** Produce a plausibly "live" snapshot from a base snapshot. */
function simulate(base: SystemInfo): SystemInfo {
  return {
    ...base,
    cpuUsage: drift(base.cpuUsage, 18),
    gpuUsage: drift(base.gpuUsage, 22),
    ramUsage: drift(base.ramUsage, 8),
    cpuTempC: drift(base.cpuTempC, 6, 40, 90),
    gpuTempC: drift(base.gpuTempC, 8, 40, 90),
    fanRpm: drift(base.fanRpm, 240, 800, 2600),
    network: {
      ...base.network,
      latencyMs: drift(base.network.latencyMs, 6, 4, 60),
      jitterMs: drift(base.network.jitterMs, 3, 0, 20),
    },
  };
}

export const SystemService = {
  /** Full system snapshot (specs + live metrics + network). */
  async getSystemInfo(): Promise<SystemInfo> {
    if (agentConfig.useMock) return mockDelay(systemInfo);
    return apiClient.get<SystemInfo>("/system");
  },

  /** Compact online + specs view for the status card. */
  async getStatus(): Promise<PcStatus> {
    const info = await this.getSystemInfo();
    return { online: info.online, specs: info.specs };
  },

  /** Network-only snapshot. */
  async getNetworkInfo(): Promise<NetworkInfo> {
    if (agentConfig.useMock) return mockDelay(networkInfo);
    return apiClient.get<NetworkInfo>("/system/network");
  },

  /**
   * Live system telemetry. Calls `onData` on every update. Returns an
   * unsubscribe function. Uses simulated drift in mock mode; the real Lave
   * Agent WebSocket `system` topic otherwise.
   */
  subscribe(onData: (info: SystemInfo) => void): () => void {
    if (agentConfig.useMock) {
      const id = setInterval(() => onData(simulate(systemInfo)), agentConfig.pollIntervalMs);
      return () => clearInterval(id);
    }
    return websocketService.subscribe<SystemInfo>("system", onData);
  },
};
