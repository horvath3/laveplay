// Service layer barrel — the single import surface for the UI.
//
// Pages and components import from "@/services" only. They never touch the
// mock data module or transport details directly. To go live with the Lave
// Agent, flip `useMock` in ./config — no consumer code changes.

export { agentConfig } from "./config";
export { apiClient, ApiError } from "./apiClient";
export { websocketService } from "./websocketService";
export { SystemService } from "./systemService";
export { GameService } from "./gameService";
export { StreamingService } from "./streamingService";
export { storeLabels } from "@/data/mock";
