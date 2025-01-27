import type { Serializer } from '@nestjs/microservices';

export class MqttJsonSerializer implements Serializer {
  serialize(value: unknown): unknown {
    return JSON.stringify(value);
  }
}
