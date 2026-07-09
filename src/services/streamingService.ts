import type { ControllerInfo, StreamingStatus } from "@/lib/types";
import { agentConfig } from "./config";
import { apiClient, isAgentUnavailable } from "./apiClient";
import {
  type AgentStreamingPayload,
  offlineController,
  offlineStreamingStatus,
  toStreamingDashboard,
} from "./agentAdapter";

/**
 * StreamingService — the live remote-play session: resolution, bitrate, codec,
 * connection quality and the paired controller. Backed by the Lave Agent REST
 * API.
 */

export const StreamingService = {
  /** Current streaming session status. */
  async getStatus(): Promise<StreamingStatus> {
    try {
      const [streaming, status] = await Promise.all([
        apiClient.get<AgentStreamingPayload>("/streaming"),
        apiClient.get<AgentStreamingPayload>("/streaming/status"),
      ]);
      return toStreamingDashboard(streaming, status);
    } catch (error) {
      if (isAgentUnavailable(error)) return offlineStreamingStatus;
      return { ...offlineStreamingStatus, state: "error" };
    }
  },

  /** Paired controller info. */
  async getController(): Promise<ControllerInfo> {
    return offlineController;
  },

  /** Start a streaming session (optionally for a specific game). */
  async start(gameId?: string): Promise<{ state: StreamingStatus["state"] }> {
    await apiClient.post<unknown>("/streaming/start", gameId ? { gameId } : undefined);
    return { state: "preparing" };
  },

  /** Stop the current streaming session. */
  async stop(): Promise<{ state: StreamingStatus["state"] }> {
    await apiClient.post<unknown>("/streaming/stop");
    return { state: "stopping" };
  },

  /** Restart the current streaming session. */
  async restart(): Promise<{ state: StreamingStatus["state"] }> {
    await this.stop();
    await this.start();
    return { state: "preparing" };
  },

  /** Live streaming telemetry. Returns an unsubscribe function. */
  subscribe(onData: (status: StreamingStatus) => void): () => void {
    const id = setInterval(() => {
      void this.getStatus().then(onData);
    }, agentConfig.pollIntervalMs);
    return () => clearInterval(id);
  },
};
