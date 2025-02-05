/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/number-literal-case */
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { DeviceCommandType } from '../../../constants/device-command-type';
import { MqttService } from '../../../mqtt/mqtt.service';
import { ACTION_MAPPING } from '../device-adapter/liquor-kiln-commnad.type';
import type { LiquorKilnCommandEnum } from '../device-adapter/liquor-kiln-firmware.type';
import type { CommandLogEntity } from '../../iot/entity/device-command.entity';
import { BaseCommand } from './base.command';
import { CommandStatus } from './iot-command.enums';
import { ICommandPayload } from './iot-command.interface';

@Injectable()
export class LiquorKilnCommand extends BaseCommand {
  private static readonly BUFFER_SIZE = 11;

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
      deviceType: DeviceCommandType.LIQUOR_KILN,
      status: CommandStatus.PENDING,
      payload: {
        deviceType: this.payload.deviceType,
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

      const action = Object.entries(this.payload.parameters ?? {}).find(
        ([_, value]) => value !== null,
      )?.[0];

      if (!this.payload.parameters) {
        throw new Error('Parameters are undefined');
      }

      if (!action) {
        throw new Error('Action is undefined');
      }

      const value = this.payload.parameters[action] as boolean | number;

      const bufferAction = LiquorKilnCommand.mapActionToEnum(
        action as keyof typeof ACTION_MAPPING,
      );
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
    buffer[0] = action & 0xff;
    buffer.writeDoubleLE(value, 1); // Đổi sang LE (little-endian)
    const checksum = this.calculateChecksum(buffer.subarray(0, 9));
    buffer.writeUInt16LE(checksum, 9); // Checksum cũng phải LE

    return buffer;
  }

  static calculateChecksum(buffer: Buffer): number {
    let crc = 0xff_ff;

    for (const element of buffer) {
      crc ^= element;

      for (let j = 0; j < 8; j++) {
        crc = crc & 0x00_01 ? (crc >> 1) ^ 0xa0_01 : crc >> 1;
      }
    }

    return crc;
  }

  private static mapActionToEnum(
    action: keyof typeof ACTION_MAPPING,
  ): LiquorKilnCommandEnum {
    const mappedAction = ACTION_MAPPING[action];

    if (!mappedAction) {
      throw new Error(`Unknown action: ${action}`);
    }

    return mappedAction;
  }
}
