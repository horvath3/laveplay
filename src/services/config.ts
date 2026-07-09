// Central configuration for talking to the Lave Agent (Windows companion app).

export const agentConfig = {
  /** Base URL of the Lave Agent REST API. */
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, ""),

  /** WebSocket endpoint the Agent streams live telemetry over. */
  wsUrl: import.meta.env.VITE_API_WS_URL ?? "",

  /** Fallback poll interval (ms) used to poll live updates. */
  pollIntervalMs: 2000,

  /** REST request timeout (ms) so a stuck Agent cannot hang the UI. */
  requestTimeoutMs: 5000,

  /** WebSocket reconnect backoff (ms). */
  reconnectDelayMs: 3000,
} as const;

export type AgentConfig = typeof agentConfig;
