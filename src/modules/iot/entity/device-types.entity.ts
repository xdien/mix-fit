import { Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

import { DeviceCommandsEntity } from './command.entity';
import { DeviceEntity } from './device.entity';

@Entity({ name: 'device_types' })
export class DeviceTypeEntity {
  @PrimaryColumn()
  deviceTypeId!: string;

  @OneToMany(() => DeviceEntity, (device) => device.deviceType)
  devices?: DeviceEntity[];

  // one device type can have many commands and one command can be used by many device types
  @ManyToMany(() => DeviceCommandsEntity, (command) => command.deviceTypes)
  commands?: DeviceCommandsEntity[];
}
