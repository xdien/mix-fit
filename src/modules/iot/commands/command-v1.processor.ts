import {
  InjectQueue,
  OnQueueEvent,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bullmq';
import { Repository } from 'typeorm';

import { QueueNameEnum } from '../../../constants/queue-key';
import { DeviceEntity } from '../../iot/entity/device.entity';
import { CommandFactory } from './command.factory';
import type {
  ICommandPayload,
  ICommandResponse,
} from './iot-command.interface';

@Injectable()
@Processor('iot-commands')
export class CommandProcessor extends WorkerHost {
  private readonly logger = new Logger(CommandProcessor.name);

  constructor(
    @InjectQueue(QueueNameEnum.REDIS_QUEUE_IOT_V1)
    private readonly commandV1Queue: Queue<ICommandPayload>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly commandFactory: CommandFactory,
  ) {
    super();
    this.logger.log('Command processor initialized');
  }

  async process(job: Job<ICommandPayload>): Promise<ICommandResponse> {
    this.logger.debug(`Processing command job ${job.id}`);

    try {
      const { deviceId } = job.data;
      const device = await this.deviceRepository.findOne({
        where: { deviceId },
      });

      if (!device) {
        await this.handleJobError(job, `Device ${deviceId} not found`);

        throw new Error(`Device ${deviceId} not found`);
      }

      await job.updateProgress(10);

      try {
        const command = this.commandFactory.createCommand(deviceId, job.data);
        const isValid = await command.validate();

        if (!isValid) {
          await this.handleJobError(job, 'Command validation failed');

          throw new Error('Command validation failed');
        }

        await command.execute();
      } catch (cmdError) {
        await this.handleJobError(job, (cmdError as Error).message);

        throw cmdError;
      }

      await job.updateProgress(100);

      if (!job.id) {
        throw new Error('Failed to create job: Job ID is undefined');
      }

      return {
        commandId: job.id,
        status: 'completed',
        result: {
          message: `Command executed successfully for device ${deviceId}`,
          timestamp: new Date().toISOString(),
        },
        executedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to process command job ${job.id}:`,
        (error as Error).stack,
      );

      if (!job.id) {
        throw new Error('Failed to create job: Job ID is undefined');
      }

      return {
        commandId: job.id,
        status: 'failed',
        error: (error as Error).message,
        executedAt: new Date(),
      };
    }
  }

  async getCommandStatus(jobId: string): Promise<ICommandResponse> {
    try {
      const job = await this.commandV1Queue.getJob(jobId);

      if (!job) {
        throw new Error(`Command job ${jobId} not found`);
      }

      const state = await job.getState();
      const result = job.returnvalue as ICommandResponse;

      if (!job.id) {
        throw new Error(`Command job ${jobId} not found`);
      }

      return {
        commandId: job.id.toString(),
        status: this.mapBullMQStateToCommandStatus(state),
        result,
        error: job.failedReason,
        executedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get command status for ${jobId}:`,
        (error as Error).stack,
      );

      throw error;
    }
  }

  // Helper method để map BullMQ state sang command status
  private mapBullMQStateToCommandStatus(
    state: string,
  ): 'completed' | 'failed' | 'waiting' {
    switch (state) {
      case 'completed': {
        return 'completed';
      }

      case 'failed': {
        return 'failed';
      }

      default: {
        return 'waiting';
      }
    }
  }

  // Event handlers
  @OnWorkerEvent('active')
  onActive(job: Job<ICommandPayload>) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data:`,
      job.data,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ICommandPayload>, result: unknown) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name} with result:`,
      result,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ICommandPayload>, error: Error) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}:`, error.stack);
  }

  @OnQueueEvent('error')
  onError(err: Error) {
    this.logger.error('Queue error:', err);
  }

  private async handleJobError(
    job: Job<ICommandPayload>,
    errorMessage: string,
  ) {
    if (job.opts.repeat) {
      //   const repeatOpts = job.opts.repeat;
      await this.commandV1Queue.removeJobScheduler(job.name);
      this.logger.debug(
        `Removed repeatable job ${job.id} due to error: ${errorMessage}`,
      );
    }

    job.discard();
    this.logger.debug(`Discarded job ${job.id} due to error: ${errorMessage}`);
  }
}
