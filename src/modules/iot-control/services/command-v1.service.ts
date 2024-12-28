import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

import { QueueName } from '../../../constants/queue-key';
// import type { BaseCommand } from '../commands/base.command';
import type { ICommandResponse } from '../commands/iot-command.interface';
import type { CommandPayloadDto } from '../dto/command-payload.dto';
import { DeviceEntity } from '../entities/device.entity';

@Injectable()
export class IoTCommandV1Service {
  private readonly logger = new Logger(IoTCommandV1Service.name);

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectQueue('iot-commands') private commandQueue: Queue,
  ) {}

  async executeCommand(
    deviceId: string,
    payload: CommandPayloadDto,
  ): Promise<ICommandResponse> {
    this.logger.debug('Finding device', deviceId);
    const device = await this.deviceRepository.findOne({
      where: { deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${deviceId} not found`);
    }

    const job = await this.commandQueue.add(QueueName.REDIS_QUEUE_IOT_V1, {
      ...payload,
    });

    if (!job.id) {
      throw new Error('Failed to create job: Job ID is undefined');
    }

    return {
      commandId: job.id,
      status: 'waiting',
    };
  }

  async getCommandStatus(commandId: string): Promise<ICommandResponse> {
    const job = await this.commandQueue.getJob(commandId);

    if (!job) {
      throw new NotFoundException(`Command ${commandId} not found`);
    }

    if (job.id === undefined) {
      throw new NotFoundException(`Command ${commandId} not found`);
    }

    return {
      commandId: job.id,
      status: await job.getState(),
      result: job.returnvalue,
    };
  }

  retryCommand(commandId: string): Promise<void> {
    // Implementation
    this.logger.debug('unimplement', commandId);

    return Promise.resolve();
  }
}
