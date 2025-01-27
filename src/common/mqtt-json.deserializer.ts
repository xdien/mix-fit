import type { Deserializer } from '@nestjs/microservices';

export class MqttJsonDeserializer implements Deserializer {
  deserialize(value: unknown, _options?: Record<string, unknown>): unknown {
    try {
      return JSON.parse((value as string).toString());
    } catch {
      return value;
    }
  }
}
