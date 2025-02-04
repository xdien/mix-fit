import { ApiProperty } from '@nestjs/swagger';
import { PrimaryColumn } from 'typeorm';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NumberFieldOptional, StringFieldOptional } from '../../../decorators';

export class DeviceDataDto extends AbstractDto {
  @ApiProperty()
  @PrimaryColumn()
  sensorId!: number;

  @ApiProperty()
  @PrimaryColumn()
  deviceId!: string;

  @ApiProperty()
  @StringFieldOptional({ nullable: true })
  dataString?: string;

  @ApiProperty()
  @NumberFieldOptional({ nullable: true })
  dataNumber?: number;
}
