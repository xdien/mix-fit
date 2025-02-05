import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StringFieldOptional } from '../../../decorators';
import { SensorEntity } from './sensor.entity';

@Entity({ name: 'measurement_units' })
export class MeasurementUnitEntity {
  @PrimaryGeneratedColumn('uuid')
  measurementUnitId?: string;

  @StringFieldOptional()
  name?: string;

  @StringFieldOptional({ nullable: true })
  description?: string;

  @StringFieldOptional({ nullable: true })
  symbol?: string;

  @OneToMany(() => SensorEntity, (sensor) => sensor.measurementUnit)
  sensors!: SensorEntity[];
}
