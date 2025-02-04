import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  BooleanFieldOptional,
  DateField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { SensorEntity } from '../../iot-control/entities/sensor.entity';

export enum MetricValueType {
  NUMERIC = 'numeric',
  TEXT = 'text',
  MEDIA = 'media',
  BINARY = 'binary',
}

@Entity('device_telemetry')
@Index(['deviceId'])
export class DeviceTelemetryEntity {
  @PrimaryGeneratedColumn('uuid')
  deviceTelemetryId!: string;

  // telemetry has one sensor and sensor has many telemetry
  @ManyToOne(() => SensorEntity, (sensor) => sensor.telemetry)
  sensor!: SensorEntity;

  @StringFieldOptional({ nullable: true })
  metricName?: string;

  @DateField()
  time!: Date;

  @StringField()
  deviceId!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({
    type: 'enum',
    enum: MetricValueType,
    nullable: false,
  })
  valueType!: MetricValueType;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  numericValue?: number;

  @StringFieldOptional({ nullable: true })
  textValue?: string;

  @StringFieldOptional({ nullable: true })
  mediaUrl?: string;

  @BooleanFieldOptional({ nullable: true })
  binaryValue?: boolean;

  setValue(value: number | string | boolean | { url: string }) {
    if (typeof value === 'number') {
      this.valueType = MetricValueType.NUMERIC;
      this.numericValue = value;
    } else if (typeof value === 'boolean') {
      this.valueType = MetricValueType.BINARY;
      this.binaryValue = value;
    } else if (typeof value === 'string') {
      this.valueType = MetricValueType.TEXT;
      this.textValue = value;
    } else if (typeof value === 'object' && 'url' in value) {
      this.valueType = MetricValueType.MEDIA;
      this.mediaUrl = value.url;
    } else {
      throw new Error('Invalid metric value');
    }
  }
}
