import { Kafka, Consumer } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { config } from "./config.js";
import { UserEvent } from "./types/index.js";

const kafka = new Kafka(config.kafka);
const registry = new SchemaRegistry({ host: config.schemaRegistry.host });

async function createConsumer(groupId: string): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: config.topic, fromBeginning: true });
  return consumer;
}

async function startConsumer(groupId: string): Promise<void> {
  const consumer = await createConsumer(groupId);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          throw new Error("Message value is null");
        }

        // Decode the Avro message
        const decodedData: UserEvent = await registry.decode(message.value);

        // Extract CloudEvents headers
        const headers = message.headers && {
          specversion: message.headers.ce_specversion?.toString(),
          type: message.headers.ce_type?.toString(),
          source: message.headers.ce_source?.toString(),
          id: message.headers.ce_id?.toString(),
          time: message.headers.ce_time?.toString(),
        };

        console.log(`[${groupId}] Received message:`);
        console.log(`Topic: ${topic}`);
        console.log(`Partition: ${partition}`);
        console.log("Headers:", headers);
        console.log("Data:", decodedData);
      } catch (error) {
        console.error(`[${groupId}] Error processing message:`, error);
        throw error;
      }
    },
  });
}

// Start multiple consumers with different group IDs
async function run(): Promise<void> {
  try {
    // Start analytics consumer group
    startConsumer("analytics-group").catch(console.error);

    // Start notifications consumer group
    startConsumer("notifications-group").catch(console.error);

    // // Start logging consumer group
    // startConsumer("logging-group").catch(console.error);

    // Keep the process running
    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
