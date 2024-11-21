import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { StringFieldOptional, UseDto } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { DeviceDto } from '../dto/device.dto';
import { DeviceTypeEntity } from './device-types.entity';

@Entity({ name: 'device' })
@UseDto(DeviceDto)
export class DeviceEntity extends AbstractEntity<DeviceDto> {
  @PrimaryColumn()
  deviceId!: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.devices)
  owner!: UserEntity;

  @StringFieldOptional({ nullable: false })
  name?: string;

  @StringFieldOptional({ nullable: true })
  description?: string;

  @StringFieldOptional({ nullable: true })
  model?: string;

  @ManyToOne(() => DeviceTypeEntity, (deviceType) => deviceType.devices)
  deviceType!: DeviceTypeEntity;
}
