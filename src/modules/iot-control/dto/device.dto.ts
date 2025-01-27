import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { BooleanFieldOptional, StringFieldOptional } from '../../../decorators';
import { DeviceTypeEntity } from '../entities/device-types.entity';

export class DeviceDto extends AbstractDto {
  @PrimaryGeneratedColumn('uuid')
  deviceId?: string;

  @StringFieldOptional({ nullable: true })
  onwerId?: string | null;

  @StringFieldOptional({ nullable: true })
  metadata?: string | null;

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
}
