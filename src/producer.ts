import { Kafka, Producer } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { CloudEvent } from "cloudevents";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "fs/promises";
import { config } from "./config.js";
import { UserEvent } from "./types/index.js";

const kafka = new Kafka(config.kafka);

const registry = new SchemaRegistry({ host: config.schemaRegistry.host });
const producer: Producer = kafka.producer();

async function registerSchema(): Promise<number> {
  const schema = JSON.parse(
    await readFile(
      new URL("./schemas/user-event.avsc", import.meta.url),
      "utf-8"
    )
  );
  const registeredSchema = await registry.register(schema);

  return registeredSchema.id;
}

async function createAndSendEvent(): Promise<void> {
  const schemaId = await registerSchema();

  const eventData: UserEvent = {
    userId: uuidv4(),
    action: "USER_CREATED",
    timestamp: Date.now(),
  };

  // Create a CloudEvent
  const event = new CloudEvent<UserEvent>({
    specversion: "1.0",
    type: "com.example.user.event",
    source: "user-service",
    id: uuidv4(),
    time: new Date().toISOString(),
    datacontenttype: "application/avro",
    data: eventData,
  });

  // Encode the data using Avro
  const encodedData = await registry.encode(schemaId, event.data);

  // Send the event
  await producer.send({
    topic: config.topic,
    messages: [
      {
        // Store CloudEvent attributes as headers
        headers: {
          ce_specversion: event.specversion,
          ce_type: event.type,
          ce_source: event.source,
          ce_id: event.id,
          ce_time: event.time,
          "content-type": event.datacontenttype,
        },
        // Store Avro-encoded data as value
        value: encodedData,
      },
    ],
  });

  console.log(`Event sent: ${event.id}`);
}

async function run(): Promise<void> {
  try {
    await producer.connect();
    await createAndSendEvent();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await producer.disconnect();
  }
}

run();
