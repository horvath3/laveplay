// Domain types for Lave Play. These mirror the payloads the future Lave Agent
// (Windows companion app) will stream over WebSocket / SSE, so the UI can be
// wired to a live source later without shape changes.

export type StorePlatform = "steam" | "epic" | "ubisoft" | "ea" | "local";

export interface Game {
  id: string;
  title: string;
  cover: string;
  store: StorePlatform;
  installed: boolean;
  favorite: boolean;
  /** ISO timestamp, or null if never played */
  lastPlayed: string | null;
  /** total play time in minutes */
  playTimeMinutes: number;
  /** installed size in GB */
  installedSizeGb: number;
  genre: string;
}

export interface PcSpecs {
  cpu: string;
  gpu: string;
  ramGb: number;
  storage: string;
  internet: string;
}

export interface PcStatus {
  online: boolean;
  specs: PcSpecs;
}

export interface PcTelemetry {
  cpuUsage: number; // %
  gpuUsage: number; // %
  ramUsage: number; // %
  cpuTempC: number;
  gpuTempC: number;
  fanRpm: number;
  batteryPercent: number | null; // null on desktops
  batteryCharging: boolean;
  currentGame: string | null;
  uptime: string;
  latencyMs: number;
  downloadMbps: number;
  uploadMbps: number;
}

export type StreamState = "idle" | "streaming" | "connecting";
export type ConnectionQuality = "excellent" | "good" | "fair" | "poor";

export interface StreamStatus {
  state: StreamState;
  resolution: string;
  fps: number;
  bitrateMbps: number;
  codec: string;
  quality: ConnectionQuality;
  latencyMs: number;
  packetLossPercent: number;
  controllerConnected: boolean;
}
