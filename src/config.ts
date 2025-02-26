import { AppConfig } from "./types/index.js";

export const config: AppConfig = {
  kafka: {
    brokers: ["localhost:9992"],
    clientId: "user-events-app",
  },
  schemaRegistry: {
    host: "http://localhost:9981",
  },
  topic: "user-events",
  retry: {
    maxRetries: 3,
    backoffMultiplier: 2, // Each retry will wait 2x longer
    maxRetryTime: 30000,
    initialRetryTime: 300,
  },
};
