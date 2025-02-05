import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

// import type { BaseCommand } from '../commands/base.command';
import type { ICommandResponse } from '../commands/iot-command.interface';
import type { CommandPayloadDto } from '../dtos/command-payload.dto';
import type { CommandResponseDto } from '../dtos/command-response.dto';
import { DeviceEntity } from '../entity/device.entity';

@Injectable()
export class IoTCommandService {
  private readonly logger = new Logger(IoTCommandService.name);

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectQueue('iot-commands') private commandQueue: Queue,
  ) {}

  async executeCommand(
    deviceId: string,
    payload: CommandPayloadDto,
  ): Promise<CommandResponseDto> {
    this.logger.debug('Finding device', deviceId);
    const device = await this.deviceRepository.findOne({
      where: { deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${deviceId} not found`);
    }

    const job = await this.commandQueue.add('iot-commands', {
      ...payload,
      deviceId,
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
