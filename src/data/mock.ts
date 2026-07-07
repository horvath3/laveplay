import type { Game, PcStatus, PcTelemetry, StreamStatus } from "@/lib/types";

import game1 from "@/assets/game-1.jpg";
import game2 from "@/assets/game-2.jpg";
import game3 from "@/assets/game-3.jpg";
import game4 from "@/assets/game-4.jpg";
import game5 from "@/assets/game-5.jpg";
import game6 from "@/assets/game-6.jpg";
import game7 from "@/assets/game-7.jpg";
import game8 from "@/assets/game-8.jpg";

// Realistic mock data. Structured to be swapped for live Lave Agent data later.

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString();

export const games: Game[] = [
  {
    id: "aetherbound",
    title: "Aetherbound",
    cover: game1,
    store: "steam",
    installed: true,
    favorite: true,
    lastPlayed: hoursAgo(3),
    playTimeMinutes: 5230,
    installedSizeGb: 84.2,
    genre: "Action RPG",
  },
  {
    id: "neon-syndicate",
    title: "Neon Syndicate",
    cover: game2,
    store: "epic",
    installed: true,
    favorite: true,
    lastPlayed: hoursAgo(20),
    playTimeMinutes: 2110,
    installedSizeGb: 112.7,
    genre: "Cyberpunk FPS",
  },
  {
    id: "apex-velocity",
    title: "Apex Velocity",
    cover: game3,
    store: "steam",
    installed: true,
    favorite: false,
    lastPlayed: daysAgo(2),
    playTimeMinutes: 940,
    installedSizeGb: 63.5,
    genre: "Racing",
  },
  {
    id: "operation-blackout",
    title: "Operation Blackout",
    cover: game4,
    store: "ea",
    installed: true,
    favorite: false,
    lastPlayed: daysAgo(5),
    playTimeMinutes: 3480,
    installedSizeGb: 148.9,
    genre: "Tactical Shooter",
  },
  {
    id: "island-drift",
    title: "Island Drift",
    cover: game5,
    store: "local",
    installed: true,
    favorite: true,
    lastPlayed: daysAgo(9),
    playTimeMinutes: 620,
    installedSizeGb: 12.1,
    genre: "Survival Craft",
  },
  {
    id: "shadow-requiem",
    title: "Shadow Requiem",
    cover: game6,
    store: "steam",
    installed: false,
    favorite: false,
    lastPlayed: null,
    playTimeMinutes: 0,
    installedSizeGb: 96.4,
    genre: "Soulslike",
  },
  {
    id: "stellar-drift",
    title: "Stellar Horizon",
    cover: game7,
    store: "epic",
    installed: false,
    favorite: true,
    lastPlayed: daysAgo(30),
    playTimeMinutes: 1780,
    installedSizeGb: 71.3,
    genre: "Space Exploration",
  },
  {
    id: "hyper-clash",
    title: "Hyper Clash",
    cover: game8,
    store: "ubisoft",
    installed: true,
    favorite: false,
    lastPlayed: hoursAgo(48),
    playTimeMinutes: 4025,
    installedSizeGb: 54.8,
    genre: "Hero Shooter",
  },
];

export const pcStatus: PcStatus = {
  online: true,
  specs: {
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "NVIDIA GeForce RTX 4080",
    ramGb: 32,
    storage: "2 TB NVMe SSD",
    internet: "940 Mbps Fiber",
  },
};

export const pcTelemetry: PcTelemetry = {
  cpuUsage: 34,
  gpuUsage: 58,
  ramUsage: 47,
  cpuTempC: 61,
  gpuTempC: 67,
  fanRpm: 1420,
  batteryPercent: null,
  batteryCharging: false,
  currentGame: "Aetherbound",
  uptime: "2d 14h 32m",
  latencyMs: 12,
  downloadMbps: 938,
  uploadMbps: 412,
};

export const streamStatus: StreamStatus = {
  state: "streaming",
  resolution: "1920 × 1080",
  fps: 60,
  bitrateMbps: 45,
  codec: "H.265 (HEVC)",
  quality: "excellent",
  latencyMs: 14,
  packetLossPercent: 0.1,
  controllerConnected: true,
};

export const storeLabels: Record<Game["store"], string> = {
  steam: "Steam",
  epic: "Epic Games",
  ubisoft: "Ubisoft Connect",
  ea: "EA App",
  local: "Local",
};
