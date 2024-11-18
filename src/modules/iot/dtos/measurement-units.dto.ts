import { PrimaryGeneratedColumn } from 'typeorm';

import { StringFieldOptional } from '../../../decorators';

export class MeasurementUnitsDto {
  @PrimaryGeneratedColumn('uuid')
  measurementUnitId?: string;

  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @StringFieldOptional({ nullable: true })
  description?: string | null;

  @StringFieldOptional({ nullable: true })
  symbol?: string | null;
}
