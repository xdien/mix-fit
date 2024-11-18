/* eslint-disable unicorn/number-literal-case */
import type { ICommand } from '@nestjs/cqrs';

import type { ICommandPayload } from './iot-command.interface';

export abstract class BaseCommand implements ICommand {
  constructor(
    protected readonly deviceId: string,
    protected readonly payload: ICommandPayload,
  ) {}

  abstract execute(): Promise<void>;

  abstract validate(): Promise<boolean>;

  toJSON() {
    return {
      deviceId: this.deviceId,
      payload: {
        parameters: this.payload.parameters,
      },
    };
  }
}
