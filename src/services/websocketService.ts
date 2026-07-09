import { agentConfig } from "./config";

/**
 * WebSocket service placeholder for live Lave Agent telemetry.
 *
 * The Agent will push topic-tagged JSON frames like:
 *   { "topic": "system", "payload": { ...SystemInfo } }
 *   { "topic": "streaming", "payload": { ...StreamingStatus } }
 *
 * Consumers subscribe to a topic and receive typed payloads. The current Lave
 * Agent integration polls REST endpoints; this class remains ready for a
 * future socket endpoint.
 */

export type Topic = "system" | "streaming" | "network" | "games";
type Handler<T = unknown> = (payload: T) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers = new Map<Topic, Set<Handler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldConnect = false;

  /** Subscribe to a topic. Returns an unsubscribe function. */
  subscribe<T>(topic: Topic, handler: Handler<T>): () => void {
    if (!this.handlers.has(topic)) this.handlers.set(topic, new Set());
    this.handlers.get(topic)!.add(handler as Handler);

    if (agentConfig.wsUrl) this.connect();

    return () => {
      this.handlers.get(topic)?.delete(handler as Handler);
      if (this.totalHandlers() === 0) this.disconnect();
    };
  }

  /** Whether a live socket is currently open. */
  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private connect() {
    if (this.socket || this.isConnected) return;
    this.shouldConnect = true;

    try {
      this.socket = new WebSocket(agentConfig.wsUrl);
      this.socket.onmessage = (event) => {
        try {
          const { topic, payload } = JSON.parse(event.data) as {
            topic: Topic;
            payload: unknown;
          };
          this.handlers.get(topic)?.forEach((h) => h(payload));
        } catch {
          /* ignore malformed frames */
        }
      };
      this.socket.onclose = () => {
        this.socket = null;
        if (this.shouldConnect) this.scheduleReconnect();
      };
      this.socket.onerror = () => this.socket?.close();
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldConnect) this.connect();
    }, agentConfig.reconnectDelayMs);
  }

  private disconnect() {
    this.shouldConnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  private totalHandlers() {
    let n = 0;
    this.handlers.forEach((set) => (n += set.size));
    return n;
  }
}

/** Singleton — one socket shared across the app. */
export const websocketService = new WebSocketService();
