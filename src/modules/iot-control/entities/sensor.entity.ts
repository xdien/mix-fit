import { PrimaryGeneratedColumn } from 'typeorm';

import { StringFieldOptional } from '../../../decorators';

export class SensorEntity {
  @PrimaryGeneratedColumn('uuid')
  sensorId!: Uuid;

  @StringFieldOptional({ nullable: false })
  name!: string | null;

  @StringFieldOptional({ nullable: true })
  description?: string | null;

  @StringFieldOptional({ nullable: true })
  type?: string | null;

  @StringFieldOptional({ nullable: true })
  measurementUnitId?: string | null;

  @StringFieldOptional({ nullable: true })
  locationId?: string | null;

  @StringFieldOptional({ nullable: true })
  metadata?: Record<string, unknown> | null;
}
