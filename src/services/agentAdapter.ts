import type {
  ConnectionQuality,
  ControllerInfo,
  Game,
  NetworkInfo,
  PcStatus,
  StreamState,
  StorePlatform,
  StreamingStatus,
  SystemInfo,
} from "@/lib/types";
import { agentConfig } from "./config";

export interface AgentHealth {
  name: string;
  version: string;
  online: boolean;
  startedAt: string;
}

export interface AgentSystem {
  cpuName?: string;
  cpuUsagePercent?: number;
  totalRamBytes?: number;
  usedRamBytes?: number;
  totalRamFormatted?: string;
  usedRamFormatted?: string;
  windowsVersion?: string;
  machineName?: string;
  uptime?: string;
  uptimeFormatted?: string;
}

export interface AgentLauncher {
  name: string;
  installed: boolean;
  installPath: string | null;
  executablePath: string | null;
  running: boolean;
  version: string | null;
}

export interface AgentGame {
  id: string;
  gameId?: string;
  name: string;
  launcher: string;
  installed: boolean;
  installPath: string | null;
  executablePath: string | null;
  executable?: string | null;
  launchCommand: string | null;
  imageUrl: string;
  coverImage?: string;
  bannerImage?: string;
  icon?: string;
  playable: boolean;
  favorite: boolean;
  lastPlayed: string | null;
  estimatedSize?: number | null;
  estimatedSizeGB?: number | null;
  version?: string | null;
}

export interface AgentSession {
  sessionId: string;
  gameId: string;
  gameName: string;
  launcher: string;
  status: string;
  startedAt: string | null;
  runningTime: string;
}

export interface AgentSunshine {
  installed: boolean;
  running: boolean;
  status: string;
  version: string | null;
  port: number;
  installPath: string | null;
  executablePath: string | null;
}

export type AgentStreamingPayload = Record<string, unknown>;

export const storeLabels: Record<StorePlatform, string> = {
  steam: "Steam",
  epic: "Epic Games",
  ubisoft: "Ubisoft Connect",
  ea: "EA App",
  local: "Local",
};

export const offlineNetwork: NetworkInfo = {
  latencyMs: 0,
  jitterMs: 0,
  downloadMbps: 0,
  uploadMbps: 0,
  packetLossPercent: 0,
  quality: "poor",
  connectionType: "ethernet",
  ssid: null,
};

export const offlineController: ControllerInfo = {
  connected: false,
  model: "No controller",
  type: "generic",
  batteryPercent: null,
  playerSlot: 0,
};

export const offlineSystemInfo: SystemInfo = {
  online: false,
  specs: {
    cpu: "Lave Agent unavailable",
    gpu: "Unknown",
    ramGb: 0,
    storage: "Unknown",
    internet: "Offline",
  },
  cpuUsage: 0,
  gpuUsage: 0,
  ramUsage: 0,
  cpuTempC: 0,
  gpuTempC: 0,
  fanRpm: 0,
  batteryPercent: null,
  batteryCharging: false,
  currentGame: null,
  uptime: "Offline",
  network: offlineNetwork,
};

export const offlineStreamingStatus: StreamingStatus = {
  state: "error",
  gameName: null,
  sunshineInstalled: false,
  resolution: "0 x 0",
  fps: 0,
  bitrateMbps: 0,
  codec: "Unknown",
  quality: "poor",
  latencyMs: 0,
  packetLossPercent: 0,
  hdr: false,
  sessionDuration: "00:00:00",
  audio: {
    enabled: false,
    codec: "Unknown",
    channels: "Stereo",
    sampleRateKhz: 0,
  },
  controller: offlineController,
};

export function toPcStatus(system: SystemInfo): PcStatus {
  return { online: system.online, specs: system.specs };
}

export function toSystemInfo(
  system: AgentSystem,
  health?: AgentHealth,
  session?: AgentSession,
): SystemInfo {
  const ramGb = bytesToGb(system.totalRamBytes);
  const ramUsage = percent(system.usedRamBytes ?? 0, system.totalRamBytes ?? 0);

  return {
    online: health?.online ?? true,
    specs: {
      cpu: system.cpuName || "Unknown CPU",
      gpu: "Unknown",
      ramGb,
      storage: system.machineName || "Unknown",
      internet: "Local Agent",
    },
    cpuUsage: Math.round(system.cpuUsagePercent ?? 0),
    gpuUsage: 0,
    ramUsage,
    cpuTempC: 0,
    gpuTempC: 0,
    fanRpm: 0,
    batteryPercent: null,
    batteryCharging: false,
    currentGame: session?.gameName || null,
    uptime: system.uptimeFormatted || system.uptime || "Unknown",
    network: {
      ...offlineNetwork,
      quality: "good",
      connectionType: "ethernet",
    },
  };
}

export function toGame(game: AgentGame): Game {
  const store = launcherToStore(game.launcher);
  const title = game.name || "Unknown Game";
  const gameId = game.gameId || game.id;
  const cover = toAgentAssetUrl(game.coverImage ?? game.imageUrl ?? "");
  const banner = toAgentAssetUrl(game.bannerImage || game.imageUrl || "");
  const icon = toAgentAssetUrl(game.icon || "");

  return {
    id: gameId,
    gameId,
    title,
    cover,
    banner,
    icon,
    launcher: game.launcher || storeLabels[store],
    version: game.version ?? null,
    store,
    installed: game.installed,
    favorite: Boolean(game.favorite),
    lastPlayed: game.lastPlayed,
    playTimeMinutes: 0,
    installedSizeGb: game.estimatedSizeGB ?? bytesToGb(game.estimatedSize ?? undefined),
    genre: storeLabels[store],
    addedAt: game.lastPlayed ?? new Date(0).toISOString(),
    developer: game.launcher || storeLabels[store],
    publisher: game.launcher || storeLabels[store],
    releaseYear: new Date().getFullYear(),
    rating: game.playable ? 80 : 0,
    description: game.installPath
      ? `${title} is installed via ${game.launcher}.`
      : `${title} is available via ${game.launcher}.`,
    achievements: { unlocked: 0, total: 0 },
    controllerSupport: "full",
    streamingCompat: game.playable ? "supported" : "experimental",
    recommended: game.playable && game.installed,
  };
}

function toAgentAssetUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return value;
  return `${agentConfig.baseUrl}${value}`;
}

export function toStreamingStatus(
  session: AgentSession,
  sunshine?: AgentSunshine,
): StreamingStatus {
  const state = session.status?.toLowerCase() === "idle" ? "idle" : "streaming";
  const quality = sunshineQuality(sunshine);

  return {
    ...offlineStreamingStatus,
    state,
    gameName: session.gameName || null,
    sunshineInstalled: Boolean(sunshine?.installed),
    quality,
    resolution: state === "streaming" ? "1920 x 1080" : offlineStreamingStatus.resolution,
    fps: state === "streaming" ? 60 : 0,
    bitrateMbps: state === "streaming" ? 25 : 0,
    codec: sunshine?.running ? "Sunshine" : "Unknown",
    sessionDuration: session.runningTime || "00:00:00",
    audio: {
      enabled: state === "streaming",
      codec: "Opus",
      channels: "Stereo",
      sampleRateKhz: state === "streaming" ? 48 : 0,
    },
  };
}

export function toStreamingDashboard(
  streaming?: AgentStreamingPayload,
  status?: AgentStreamingPayload,
): StreamingStatus {
  const merged = deepMerge(streaming, status);
  const state = toStreamState(readString(merged, "status", "state", "streamingStatus"));
  const gameName =
    readString(merged, "gameName", "game", "activeGame", "currentGame", "title", "name") ||
    readNestedString(merged, ["game", "name"], ["game", "title"], ["session", "gameName"]);
  const sunshineInstalled =
    readBoolean(merged, "sunshineInstalled", "isSunshineInstalled") ??
    readNestedBoolean(merged, ["sunshine", "installed"]) ??
    true;
  const audioEnabled =
    readBoolean(merged, "audio", "audioEnabled") ??
    readNestedBoolean(merged, ["audio", "enabled"]) ??
    false;
  const controllerConnected =
    readBoolean(merged, "controller", "controllerConnected") ??
    readNestedBoolean(merged, ["controller", "connected"]) ??
    false;

  return {
    state,
    gameName: gameName || null,
    sunshineInstalled,
    resolution: readResolution(merged),
    fps: readNumber(merged, "fps", "frameRate") ?? 0,
    bitrateMbps: readBitrateMbps(merged),
    codec: readString(merged, "codec", "videoCodec") || "Unknown",
    quality: state === "error" ? "poor" : state === "streaming" ? "excellent" : "good",
    latencyMs: readNumber(merged, "latencyMs", "latency") ?? 0,
    packetLossPercent: readNumber(merged, "packetLossPercent", "packetLoss") ?? 0,
    hdr: readBoolean(merged, "hdr", "hdrEnabled") ?? false,
    sessionDuration:
      readString(merged, "sessionDuration", "runningTime", "duration") ||
      readNestedString(merged, ["session", "runningTime"]) ||
      "00:00:00",
    audio: {
      enabled: audioEnabled,
      codec: readNestedString(merged, ["audio", "codec"]) || "Unknown",
      channels:
        readNestedString(merged, ["audio", "channels"]) || (audioEnabled ? "Stereo" : "Off"),
      sampleRateKhz: readNestedNumber(merged, ["audio", "sampleRateKhz"]) ?? 0,
    },
    controller: {
      connected: controllerConnected,
      model:
        readString(merged, "controllerModel") ||
        readNestedString(merged, ["controller", "model"]) ||
        "No controller",
      type: "generic",
      batteryPercent: readNestedNumber(merged, ["controller", "batteryPercent"]),
      playerSlot: readNestedNumber(merged, ["controller", "playerSlot"]) ?? 0,
    },
  };
}

function launcherToStore(launcher: string): StorePlatform {
  const normalized = launcher.toLowerCase();
  if (normalized.includes("steam")) return "steam";
  if (normalized.includes("epic")) return "epic";
  if (normalized.includes("ubisoft")) return "ubisoft";
  if (normalized.includes("ea")) return "ea";
  return "local";
}

function bytesToGb(bytes?: number): number {
  if (!bytes || bytes < 0) return 0;
  return Math.round((bytes / 1024 ** 3) * 10) / 10;
}

function percent(used: number, total: number): number {
  if (!total) return 0;
  return Math.round(Math.max(0, Math.min(100, (used / total) * 100)));
}

function sunshineQuality(sunshine?: AgentSunshine): ConnectionQuality {
  if (!sunshine?.installed) return "poor";
  return sunshine.running ? "excellent" : "good";
}

function deepMerge(
  base?: AgentStreamingPayload,
  override?: AgentStreamingPayload,
): AgentStreamingPayload {
  return { ...(base ?? {}), ...(override ?? {}) };
}

function toStreamState(value: string): StreamState {
  const normalized = value.toLowerCase().replace(/\s+/g, "");
  if (normalized.includes("prepar")) return "preparing";
  if (normalized.includes("ready")) return "ready";
  if (normalized.includes("stream")) return "streaming";
  if (normalized.includes("stopp") && !normalized.includes("stopped")) return "stopping";
  if (normalized.includes("stop") || normalized.includes("idle")) return "stopped";
  if (normalized.includes("connect")) return "preparing";
  if (normalized.includes("error") || normalized.includes("fail")) return "error";
  return "stopped";
}

function readResolution(source: AgentStreamingPayload): string {
  const explicit = readString(source, "resolution");
  if (explicit) return explicit;

  const width = readNumber(source, "width", "streamWidth");
  const height = readNumber(source, "height", "streamHeight");
  if (width && height) return `${width} x ${height}`;

  return "0 x 0";
}

function readBitrateMbps(source: AgentStreamingPayload): number {
  const mbps = readNumber(source, "bitrateMbps", "bitrateMBps");
  if (mbps !== undefined) return mbps;

  const raw = readNumber(source, "bitrate", "bitrateKbps", "bitrateBps");
  if (!raw) return 0;
  if (raw > 1_000_000) return Math.round((raw / 1_000_000) * 10) / 10;
  if (raw > 1_000) return Math.round((raw / 1_000) * 10) / 10;
  return raw;
}

function readString(source: AgentStreamingPayload, ...keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }
  return "";
}

function readNumber(source: AgentStreamingPayload, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = source[key];
    const numberValue = toNumber(value);
    if (numberValue !== undefined) return numberValue;
  }
  return undefined;
}

function readBoolean(source: AgentStreamingPayload, ...keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = source[key];
    const boolValue = toBoolean(value);
    if (boolValue !== undefined) return boolValue;
  }
  return undefined;
}

function readNestedString(source: AgentStreamingPayload, ...paths: string[][]): string {
  for (const path of paths) {
    const value = readPath(source, path);
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }
  return "";
}

function readNestedNumber(source: AgentStreamingPayload, path: string[]): number | null {
  return toNumber(readPath(source, path)) ?? null;
}

function readNestedBoolean(source: AgentStreamingPayload, path: string[]): boolean | undefined {
  return toBoolean(readPath(source, path));
}

function readPath(source: AgentStreamingPayload, path: string[]): unknown {
  let value: unknown = source;
  for (const segment of path) {
    if (!value || typeof value !== "object") return undefined;
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (["true", "yes", "enabled", "on", "installed", "running"].includes(normalized)) return true;
    if (["false", "no", "disabled", "off", "notinstalled", "stopped"].includes(normalized))
      return false;
  }
  return undefined;
}
