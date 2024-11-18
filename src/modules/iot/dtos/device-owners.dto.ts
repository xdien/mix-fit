import { PrimaryGeneratedColumn } from 'typeorm';

import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';

export class DeviceOwnersDto extends AbstractWithIdDto {
  @PrimaryGeneratedColumn('uuid')
  deviceOwnerId?: string | null;
}
