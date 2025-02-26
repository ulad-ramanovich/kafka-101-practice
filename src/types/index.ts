import { KafkaConfig } from "kafkajs";

export interface UserEvent {
  userId: string;
  action: string;
  timestamp: number;
}

export interface SchemaRegistryConfig {
  host: string;
}

export interface AppConfig {
  kafka: KafkaConfig;
  schemaRegistry: SchemaRegistryConfig;
  topic: string;
}
