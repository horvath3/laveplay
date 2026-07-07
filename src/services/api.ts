import { games, pcStatus, pcTelemetry, streamStatus } from "@/data/mock";
import type { Game, PcStatus, PcTelemetry, StreamStatus } from "@/lib/types";

/*
 * Service layer — the single boundary between UI and data.
 *
 * Today these return mock data. Later, the Lave Agent (Windows companion app)
 * will push live telemetry over WebSocket / SSE; only this file changes.
 * UI components import from here, never from the mock module directly.
 */

export async function fetchGames(): Promise<Game[]> {
  return games;
}

export async function fetchPcStatus(): Promise<PcStatus> {
  return pcStatus;
}

export async function fetchPcTelemetry(): Promise<PcTelemetry> {
  return pcTelemetry;
}

export async function fetchStreamStatus(): Promise<StreamStatus> {
  return streamStatus;
}

/**
 * Placeholder for the future live telemetry stream. When Lave Agent is
 * available this will open a WebSocket / EventSource and invoke `onData`
 * on every frame. For now it emulates live values with small drift so the
 * My PC dashboard feels alive.
 */
export function subscribeTelemetry(
  onData: (t: PcTelemetry) => void,
  intervalMs = 2000,
): () => void {
  const jitter = (base: number, spread: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, Math.round(base + (Math.random() - 0.5) * spread)));

  const id = setInterval(() => {
    onData({
      ...pcTelemetry,
      cpuUsage: jitter(pcTelemetry.cpuUsage, 18),
      gpuUsage: jitter(pcTelemetry.gpuUsage, 22),
      ramUsage: jitter(pcTelemetry.ramUsage, 8),
      cpuTempC: jitter(pcTelemetry.cpuTempC, 6, 40, 90),
      gpuTempC: jitter(pcTelemetry.gpuTempC, 8, 40, 90),
      fanRpm: jitter(pcTelemetry.fanRpm, 240, 800, 2600),
      latencyMs: jitter(pcTelemetry.latencyMs, 6, 4, 60),
    });
  }, intervalMs);

  return () => clearInterval(id);
}
