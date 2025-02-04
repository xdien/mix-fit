import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeviceCommandType } from '../../../constants/device-command-type';
import { MqttService } from '../../../mqtt/mqtt.service';
import { CommandLogEntity } from '../../iot/entity/device-command.entity';
import type { BaseCommand } from './base.command';
import { BaseCommandFactory } from './base-command.factory';
import type { ICommandPayload } from './iot-command.interface';
import { LiquorKilnCommand } from './liquor-kiln.command';
import { LiquorKilnV1Command } from './liquor-kiln-v1.command';

export class CommandFactory extends BaseCommandFactory {
  private readonly logger = new Logger(CommandFactory.name);

  constructor(
    @InjectRepository(CommandLogEntity)
    private readonly deviceCommandRepo: Repository<CommandLogEntity>,
    private readonly mqttService: MqttService,
  ) {
    super();
  }

  private getRepository(type: string): Repository<CommandLogEntity> {
    this.logger.debug(`Getting repository for type ${type}`);

    if (type === 'DEVICE') {
      this.logger.debug(`Returning device command repository`);

      return this.deviceCommandRepo;
    }

    throw new Error(`Unknown repository type: ${type}`);
  }

  public createCommand(
    deviceId: string,
    payload: ICommandPayload,
  ): BaseCommand {
    const repository = this.getRepository(payload.repositoryType ?? 'DEVICE');

    this.logger.debug(`Creating command for device ${deviceId}`);

    if (
      (payload.deviceType as DeviceCommandType) ===
      DeviceCommandType.LIQUOR_KILN
    ) {
      return new LiquorKilnCommand(
        deviceId,
        payload,
        repository,
        this.mqttService,
      );
    } else if (
      (payload.deviceType as DeviceCommandType) ===
      DeviceCommandType.LIQUOR_KILN_V1
    ) {
      return new LiquorKilnV1Command(
        deviceId,
        payload,
        repository,
        this.mqttService,
      );
    }

    throw new Error(`Unknown command type: ${payload.deviceType}`);
  }
}
