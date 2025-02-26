export interface UserEvent {
  userId: string;
  action: string;
  timestamp: number;
}

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
}

export interface SchemaRegistryConfig {
  host: string;
}

export interface RetryConfig {
  maxRetries: number;
  maxRetryTime: number;
  initialRetryTime: number;
  backoffMultiplier: number;
}

export interface AppConfig {
  kafka: KafkaConfig;
  schemaRegistry: SchemaRegistryConfig;
  topic: string;
  retry: RetryConfig;
}
