// Central configuration for talking to the Lave Agent (Windows companion app).
//
// While `useMock` is true the services return realistic local data. Flip it to
// false (or set the env vars below) once the Agent is reachable, and the same
// service methods will call real HTTP endpoints / open the real WebSocket —
// no page or component changes required.

export const agentConfig = {
  /** Master switch. When true, services serve mock data. */
  useMock: (import.meta.env.VITE_LAVE_USE_MOCK ?? "true") !== "false",

  /** Base URL of the Lave Agent REST API. */
  baseUrl: import.meta.env.VITE_LAVE_AGENT_URL ?? "http://localhost:5195",

  /** WebSocket endpoint the Agent streams live telemetry over. */
  wsUrl: import.meta.env.VITE_LAVE_AGENT_WS ?? "ws://localhost:5195/ws",

  /** Fallback poll interval (ms) used to simulate / poll live updates. */
  pollIntervalMs: 2000,

  /** WebSocket reconnect backoff (ms). */
  reconnectDelayMs: 3000,
} as const;

export type AgentConfig = typeof agentConfig;
