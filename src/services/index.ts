// Service layer barrel — the single import surface for the UI.
//
// Pages and components import from "@/services" only. They never touch the
// transport details directly.

export { agentConfig } from "./config";
export { apiClient, ApiConnectionError, ApiError } from "./apiClient";
export { websocketService } from "./websocketService";
export { SystemService } from "./systemService";
export { GameService } from "./gameService";
export { StreamingService } from "./streamingService";
export { storeLabels } from "./agentAdapter";
