import { AppConfig } from "./types/index.js";

export const config: AppConfig = {
  kafka: {
    brokers: ["localhost:9992"],
    clientId: "user-events-app",
    retry: {
      retries: 3,
      factor: 2, // Each retry will wait 2x longer
      maxRetryTime: 3000, // 3 seconds
    },
  },
  schemaRegistry: {
    host: "http://localhost:9981",
  },
  topic: "user-events",
};
