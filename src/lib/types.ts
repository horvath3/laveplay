// Domain types for Lave Play.
//
// These interfaces are the contract between the UI and the service layer.
// They intentionally mirror the payloads the future **Lave Agent** (the
// Windows companion app) will expose over HTTP and stream over WebSocket,
// so the UI can be wired to a live source later without any shape changes.

/* -------------------------------------------------------------------------- */
/* Games                                                                      */
/* -------------------------------------------------------------------------- */

export type StorePlatform = "steam" | "epic" | "ubisoft" | "ea" | "local";
export type ControllerSupport = "full" | "partial" | "none";
export type StreamingCompat = "optimized" | "supported" | "experimental";

export interface Achievements {
  unlocked: number;
  total: number;
}

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
  /** ISO timestamp the title was added to the library */
  addedAt: string;
  developer: string;
  publisher: string;
  releaseYear: number;
  /** critic score out of 100 */
  rating: number;
  description: string;
  achievements: Achievements;
  controllerSupport: ControllerSupport;
  streamingCompat: StreamingCompat;
  /** true when the platform recommends this title to the user */
  recommended: boolean;
}


/* -------------------------------------------------------------------------- */
/* System                                                                     */
/* -------------------------------------------------------------------------- */

export interface PcSpecs {
  cpu: string;
  gpu: string;
  ramGb: number;
  storage: string;
  internet: string;
}

/**
 * Full live snapshot of the host gaming PC. The Lave Agent will emit this
 * shape both from `GET /system` and as `system` frames over the socket.
 */
export interface SystemInfo {
  online: boolean;
  specs: PcSpecs;
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
  network: NetworkInfo;
}

/** Convenience subset used by the compact status card. */
export type PcStatus = Pick<SystemInfo, "online" | "specs">;

/* -------------------------------------------------------------------------- */
/* Network                                                                    */
/* -------------------------------------------------------------------------- */

export type ConnectionQuality = "excellent" | "good" | "fair" | "poor";
export type ConnectionType = "fiber" | "ethernet" | "wifi" | "cellular";

export interface NetworkInfo {
  latencyMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  packetLossPercent: number;
  quality: ConnectionQuality;
  connectionType: ConnectionType;
  ssid: string | null;
}

/* -------------------------------------------------------------------------- */
/* Controller                                                                 */
/* -------------------------------------------------------------------------- */

export type ControllerType = "xbox" | "playstation" | "generic" | "keyboard";

export interface ControllerInfo {
  connected: boolean;
  model: string;
  type: ControllerType;
  batteryPercent: number | null; // null when wired / no battery
  playerSlot: number;
}

/* -------------------------------------------------------------------------- */
/* Streaming                                                                  */
/* -------------------------------------------------------------------------- */

export type StreamState = "idle" | "connecting" | "streaming";

export interface StreamingStatus {
  state: StreamState;
  resolution: string;
  fps: number;
  bitrateMbps: number;
  codec: string;
  quality: ConnectionQuality;
  latencyMs: number;
  packetLossPercent: number;
  controller: ControllerInfo;
}
