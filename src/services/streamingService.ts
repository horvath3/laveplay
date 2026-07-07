import { controllerInfo, streamingStatus } from "@/data/mock";
import type { ControllerInfo, StreamingStatus } from "@/lib/types";
import { agentConfig } from "./config";
import { apiClient, mockDelay } from "./apiClient";
import { websocketService } from "./websocketService";

/**
 * StreamingService — the live remote-play session: resolution, bitrate, codec,
 * connection quality and the paired controller. Mock data + simulated drift
 * today; the Lave Agent `streaming` WebSocket topic later.
 */

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const drift = (base: number, spread: number, min: number, max: number) =>
  clamp(Math.round(base + (Math.random() - 0.5) * spread), min, max);

function simulate(base: StreamingStatus): StreamingStatus {
  return {
    ...base,
    fps: drift(base.fps, 4, 30, 60),
    bitrateMbps: drift(base.bitrateMbps, 8, 15, 80),
    latencyMs: drift(base.latencyMs, 6, 4, 60),
    packetLossPercent: Math.max(0, +(base.packetLossPercent + (Math.random() - 0.5) * 0.2).toFixed(2)),
  };
}

export const StreamingService = {
  /** Current streaming session status. */
  async getStatus(): Promise<StreamingStatus> {
    if (agentConfig.useMock) return mockDelay(streamingStatus);
    return apiClient.get<StreamingStatus>("/streaming/status");
  },

  /** Paired controller info. */
  async getController(): Promise<ControllerInfo> {
    if (agentConfig.useMock) return mockDelay(controllerInfo);
    return apiClient.get<ControllerInfo>("/streaming/controller");
  },

  /** Start a streaming session (optionally for a specific game). */
  async start(gameId?: string): Promise<{ state: StreamingStatus["state"] }> {
    if (agentConfig.useMock) return mockDelay({ state: "connecting" });
    return apiClient.post<{ state: StreamingStatus["state"] }>("/streaming/start", { gameId });
  },

  /** Stop the current streaming session. */
  async stop(): Promise<{ state: StreamingStatus["state"] }> {
    if (agentConfig.useMock) return mockDelay({ state: "idle" });
    return apiClient.post<{ state: StreamingStatus["state"] }>("/streaming/stop");
  },

  /** Live streaming telemetry. Returns an unsubscribe function. */
  subscribe(onData: (status: StreamingStatus) => void): () => void {
    if (agentConfig.useMock) {
      const id = setInterval(() => onData(simulate(streamingStatus)), agentConfig.pollIntervalMs);
      return () => clearInterval(id);
    }
    return websocketService.subscribe<StreamingStatus>("streaming", onData);
  },
};
