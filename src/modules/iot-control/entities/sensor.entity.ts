import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { StringFieldOptional } from '../../../decorators';
import { DeviceTelemetryEntity } from '../../device-telemetry/enties/device-telemetry.entity';
import { MeasurementUnitEntity } from './measurement-units.entity';

@Entity({ name: 'sensors' })
export class SensorEntity {
  @PrimaryGeneratedColumn('uuid')
  sensorId!: Uuid;

  @StringFieldOptional()
  name!: string;

  @StringFieldOptional({ nullable: true })
  description?: string;

  @StringFieldOptional({ nullable: true })
  type?: string;

  @StringFieldOptional({ nullable: true })
  locationId?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, unknown>;

  @OneToMany(() => DeviceTelemetryEntity, (telemetry) => telemetry.sensor)
  telemetry!: DeviceTelemetryEntity[];

  @ManyToOne(
    () => MeasurementUnitEntity,
    (measurementUnit) => measurementUnit.sensors,
  )
  measurementUnit!: MeasurementUnitEntity;
}
