import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import {
  BooleanFieldOptional,
  StringFieldOptional,
  UseDto,
} from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { DeviceDto } from '../dtos/device.dto';
import { DeviceTypeEntity } from './device-types.entity';

@Entity({ name: 'device' })
@UseDto(DeviceDto)
export class DeviceEntity extends AbstractEntity<DeviceDto> {
  @PrimaryColumn()
  deviceId!: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.devices, {
    eager: true,
  })
  owner!: UserEntity;

  @StringFieldOptional({ nullable: false })
  name?: string;

  @StringFieldOptional({ nullable: true })
  description?: string;

  @StringFieldOptional({ nullable: true })
  model?: string;

  @BooleanFieldOptional({ nullable: false, default: false })
  online!: boolean;

  @ManyToOne(() => DeviceTypeEntity, (deviceType) => deviceType.devices)
  deviceType!: DeviceTypeEntity;

  toDto(options?: undefined): DeviceDto {
    return new DeviceDto(this, options);
  }
}
