import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import {
  DateField,
  DateFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { CommandStatus } from '../../iot/commands/iot-command.enums'; // Ensure CommandStatus is exported as a value
import { ICommandPayload } from '../../iot/commands/iot-command.interface';

@Entity('command_logs')
export class CommandLogEntity {
  @PrimaryGeneratedColumn('uuid')
  deviceCommandId!: string;

  @StringField()
  deviceId!: string;

  @Column({ type: 'enum', enum: CommandStatus, default: CommandStatus.PENDING })
  status?: CommandStatus;

  // one command log can have one device type
  //   @OneToOne(() => DeviceTypeEntity)
  //   deviceType?: DeviceTypeEntity;
  @StringField()
  deviceType!: string;

  @Column({ type: 'jsonb' })
  payload!: ICommandPayload;

  @DateField()
  createdAt!: Date;

  @DateFieldOptional()
  executedAt?: Date;

  @StringFieldOptional()
  errorMessage?: string;

  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, unknown>;

  @DateFieldOptional()
  sentAt?: Date;
}
