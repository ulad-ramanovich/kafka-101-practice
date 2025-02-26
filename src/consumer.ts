import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { CloudEvent } from "cloudevents";
import { config } from "./config.js";
import { UserEvent } from "./types/index.js";

const kafka = new Kafka(config.kafka);

const registry = new SchemaRegistry({ host: config.schemaRegistry.host });
const consumer: Consumer = kafka.consumer({
  groupId: "user-events-group",
  // Set to false to prevent auto-commit
  allowAutoTopicCreation: true,
});

async function processMessage(
  messagePayload: EachMessagePayload
): Promise<void> {
  const { topic, partition, message } = messagePayload;

  try {
    if (!message.value) {
      console.error("Message value is null");
      return;
    }

    // Decode the Avro data
    const decodedData: UserEvent = await registry.decode(message.value);

    // Reconstruct CloudEvent from headers and data
    const cloudEvent = new CloudEvent<UserEvent>({
      specversion: message.headers?.ce_specversion?.toString(),
      type: message.headers?.ce_type?.toString(),
      source: message.headers?.ce_source?.toString(),
      id: message.headers?.ce_id?.toString(),
      time: message.headers?.ce_time?.toString(),
      datacontenttype: message.headers?.["content-type"]?.toString(),
      data: decodedData,
    });

    // Process the message (you can add your business logic here)
    console.log("Received CloudEvent:");
    console.log("ID:", cloudEvent.id);
    console.log("Type:", cloudEvent.type);
    console.log("Source:", cloudEvent.source);
    console.log("Time:", cloudEvent.time);
    console.log("Data:", cloudEvent.data);
    console.log("-------------------");

    // Commit the offset only after successful processing
    await consumer.commitOffsets([
      {
        topic,
        partition,
        offset: (Number(message.offset) + 1).toString(),
      },
    ]);

    console.log(
      `Committed offset ${message.offset} for partition ${partition}`
    );
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
}

async function run(): Promise<void> {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: config.topic,
      fromBeginning: true,
    });

    await consumer.run({
      autoCommit: false, // Disable auto-commit
      eachMessage: async (messagePayload) => {
        try {
          await processMessage(messagePayload);
        } catch (error) {
          console.error("Failed to process message:", error);
          throw error;
        }
      },
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
const shutdown = async (): Promise<void> => {
  try {
    await consumer.disconnect();
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

run();
