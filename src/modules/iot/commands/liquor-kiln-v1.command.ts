/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/number-literal-case */
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { DeviceCommandType } from '../../../constants/device-command-type';
import { MqttService } from '../../../mqtt/mqtt.service';
import type { CommandLogEntity } from '../../iot/entity/device-command.entity';
import { BaseCommand } from './base.command';
import { CommandStatus } from './iot-command.enums';
import { ICommandPayload } from './iot-command.interface';

enum CommandAction {
  HEATER_1 = 0,
  HEATER_2 = 1,
  HEATER_3 = 2,
  SET_OVERHEAT_TEMP = 3,
  SET_COOLING_TEMP = 4,
  SET_DISTILLATION_TIME = 6,
  RESET_WIFI = 7,
  SET_DISTILLATION_DAY_TEMP_MIN = 8,
  SET_DISTILLATION_DAY_TEMP_MAX = 9,
  SET_DISTILLATION_NIGHT_TEMP_MIN = 10,
  SET_DISTILLATION_NIGHT_TEMP_MAX = 11,
  UPDATE_TIME_NTP = 12,
  SET_TOTAL_DAY_DISTILLATION_TIME,
  SET_TOTAL_NIGHT_DISTILLATION_TIME,
  CMD_HEATER_1,
  CMD_HEATER_2,
  CMD_HEATER_SYS,
}

@Injectable()
export class LiquorKilnV1Command extends BaseCommand {
  private readonly logger = new Logger(LiquorKilnV1Command.name);

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
      deviceType: DeviceCommandType.LIQUOR_KILN_V1,
      status: CommandStatus.PENDING,
      payload: {
        deviceType: DeviceCommandType.LIQUOR_KILN_V1,
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

      await this.mqttService.publish(`devices/${this.deviceId}/commands`, {
        commandId: command.deviceCommandId,
        deviceType: command.deviceType,
        timestamp: new Date().toISOString(),
        params: { action: LiquorKilnV1Command.mapActionToEnum(action) },
      });

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
