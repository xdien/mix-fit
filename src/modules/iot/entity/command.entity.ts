import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { StringField } from '../../../decorators';
import { DeviceTypeEntity } from './device-types.entity';

@Entity({ name: 'device_commands' })
export class DeviceCommandsEntity {
  @PrimaryColumn()
  commandId!: string;

  @StringField()
  command!: string;

  @ManyToMany(() => DeviceTypeEntity, (deviceType) => deviceType.commands)
  deviceTypes?: DeviceTypeEntity[];
}
