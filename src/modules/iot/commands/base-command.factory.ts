import type { BaseCommand } from './base.command';
import type { ICommandPayload } from './iot-command.interface';

export abstract class BaseCommandFactory {
  abstract createCommand(
    deviceId: string,
    payload: ICommandPayload,
  ): BaseCommand;
}
