/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/number-literal-case */
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { MqttService } from '../../../mqtt/mqtt.service';
import type { CommandLogEntity } from '../entities/device-command.entity';
import { BaseCommand } from './base.command';
import { CommandStatus } from './iot-command.enums';
import { ICommandPayload } from './iot-command.interface';

enum CommandAction {
  HEATER_1 = 0,
  HEATER_2 = 1,
  HEATER_3 = 2,
  SET_OVERHEAT_TEMP = 3,
  SET_COOLING_TEMP = 4,
  SET_DISTILLATION_TEMP = 5,
  SET_DISTILLATION_TIME = 6,
  RESET_WIFI = 7,
}

@Injectable()
export class LiquorKilnCommand extends BaseCommand {
  private static readonly BUFFER_SIZE = 4;

  private readonly logger = new Logger(LiquorKilnCommand.name);

  validate(): Promise<boolean> {
    if (
      !this.deviceId ||
      typeof this.deviceId !== 'string' ||
      this.deviceId.trim() === ''
    ) {
      this.logger.error('Invalid deviceId');

      throw new Error('Invalid deviceId');
    }

    return Promise.resolve(true);
  }

  constructor(
    deviceId: string,
    payload: ICommandPayload,
    private readonly repository: Repository<CommandLogEntity>,
    private readonly mqttService: MqttService,
  ) {
    super(deviceId, payload);
  }

  private prepareCommandEntity(): CommandLogEntity {
    return {
      deviceId: this.deviceId,
      deviceType: 'LIQUOR-KILN',
      status: CommandStatus.PENDING,
      payload: {
        deviceType: 'LIQUOR-KILN',
        parameters: this.payload.parameters,
        deviceId: this.deviceId,
      },
      createdAt: new Date(),
    } as CommandLogEntity;
  }

  async execute(): Promise<void> {
    try {
      this.logger.debug('Executing command', this.deviceId);
      await this.validate();

      const commandData = this.prepareCommandEntity();
      const command = await this.repository.save(commandData);

      const [action] = Object.keys(this.payload.parameters ?? {});

      if (!this.payload.parameters) {
        throw new Error('Parameters are undefined');
      }

      if (!action) {
        throw new Error('Action is undefined');
      }

      const value = this.payload.parameters[action] as boolean | number;

      const bufferAction = LiquorKilnCommand.mapActionToEnum(action);
      const numericValue = typeof value === 'boolean' ? (value ? 1 : 0) : value;
      const optimizedPayload = LiquorKilnCommand.packCommand(
        bufferAction,
        numericValue,
      );

      // print buffer to hex string
      this.logger.debug(
        `Optimized payload: ${optimizedPayload.toString('hex')}`,
        `devices/${this.deviceId}/commands`,
      );
      await this.mqttService.publishRawBytes(
        `devices/${this.deviceId}/commands`,
        optimizedPayload,
      );

      await this.repository.update(command.deviceCommandId, {
        status: CommandStatus.SENT,
        sentAt: new Date(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to execute command', {
        error: errorMessage,
        deviceId: this.deviceId,
      });

      throw new Error(`Failed to execute command: ${errorMessage}`);
    }
  }

  static packCommand(action: number, value: number): Buffer {
    const buffer = Buffer.alloc(this.BUFFER_SIZE);

    // Pack action (2 bits), reserved (2 bits), and high bits of value (4 bits)
    const firstByte =
      ((action & 0x03) << 6) | // Action - 2 bits
      ((0x00 & 0x03) << 4) | // Reserved - 2 bits
      ((value >> 8) & 0x0f); // Value high - 4 bits

    buffer[0] = firstByte;
    buffer[1] = value & 0xff; // Value low - 8 bits

    const checksum = this.calculateChecksum(buffer.subarray(0, 2));
    buffer.writeUInt16BE(checksum, 2);

    return buffer;
  }

  private static calculateChecksum(data: Buffer): number {
    let crc = 0xff_ff;

    for (const byte of data) {
      crc ^= byte;

      for (let j = 0; j < 8; j++) {
        crc = crc & 0x00_01 ? (crc >> 1) ^ 0xa0_01 : crc >> 1;
      }
    }

    return crc;
  }

  private static mapActionToEnum(action: string): CommandAction {
    switch (action) {
      case 'HEATER_1': {
        return CommandAction.HEATER_1;
      }

      case 'HEATER_2': {
        return CommandAction.HEATER_2;
      }

      case 'HEATER_3': {
        return CommandAction.HEATER_3;
      }

      case 'SET_OVERHEAT_TEMP': {
        return CommandAction.SET_OVERHEAT_TEMP;
      }

      case 'SET_COOLING_TEMP': {
        return CommandAction.SET_COOLING_TEMP;
      }

      case 'SET_DISTILLATION_TEMP': {
        return CommandAction.SET_DISTILLATION_TEMP;
      }

      case 'SET_DISTILLATION_TIME': {
        return CommandAction.SET_DISTILLATION_TIME;
      }

      case 'RESET_WIFI': {
        return CommandAction.RESET_WIFI;
      }

      default: {
        throw new Error(`Unknown action: ${action}`);
      }
    }
  }
}
