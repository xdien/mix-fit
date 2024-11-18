import { Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import type { MqttClient } from 'mqtt';
import mqttConnect from 'mqtt';
import { lastValueFrom } from 'rxjs';

import { ApiConfigService } from '../shared/services/api-config.service';
import type { IMqttCommandPayload } from './mqtt.types';

@Injectable()
export class MqttService {
  client!: ClientProxy;

  private mqttClient!: MqttClient;

  //   private readonly logger = new Logger(MqttService.name);

  constructor(private apiConfigService: ApiConfigService) {}

  onModuleInit() {
    const mqttConfig = this.apiConfigService.mqttConfig;
    const url = `mqtt://${mqttConfig.host}:${mqttConfig.port}`;
    this.mqttClient = mqttConnect.connect(url, {
      username: mqttConfig.username,
      password: mqttConfig.password,
    });
    this.client = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url,
        username: mqttConfig.username,
        password: mqttConfig.password,
      },
    });
  }

  async publish(topic: string, payload: IMqttCommandPayload): Promise<void> {
    try {
      if (!this.validateCommandPayload(payload)) {
        throw new Error('Invalid MQTT command payload');
      }

      await lastValueFrom(this.client.emit(topic, payload));
    } catch (error) {
      console.error('Error publishing MQTT message:', error);

      throw error;
    }
  }

  async publishRawBytes(topic: string, buffer: Buffer) {
    return new Promise((resolve, reject) => {
      this.mqttClient.publish(topic, buffer, {}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  async send(topic: string, payload: IMqttCommandPayload): Promise<void> {
    try {
      if (!this.validateCommandPayload(payload)) {
        throw new Error('Invalid MQTT command payload');
      }

      await lastValueFrom(this.client.send(topic, payload));
    } catch (error) {
      console.error('Error sending MQTT message:', error);

      throw error;
    }
  }

  private validateCommandPayload(payload: IMqttCommandPayload): boolean {
    return Boolean(
      payload.commandId &&
        payload.timestamp &&
        ['TURN_ON', 'TURN_OFF', 'SET_TEMPERATURE', 'SET_MODE'].includes(
          payload.deviceType,
        ),
    );
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
