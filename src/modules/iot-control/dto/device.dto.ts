import { PrimaryGeneratedColumn } from 'typeorm';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../decorators';

export class DeviceDto extends AbstractDto {
  @PrimaryGeneratedColumn('uuid')
  deviceId?: string;

  @StringFieldOptional({ nullable: true })
  rentersId?: string | null;

  @StringFieldOptional({ nullable: true })
  deviceOwnerId?: string | null;

  @StringFieldOptional({ nullable: true })
  metadata?: string | null;
}
