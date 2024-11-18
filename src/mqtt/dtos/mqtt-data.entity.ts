import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class MqttDataEntity {
  @PrimaryGeneratedColumn('uuid')
  dataId!: string;

  @Column({ nullable: false, type: 'uuid' })
  deviceId!: string;

  @Column({ nullable: true, type: 'text' })
  value?: number;

  @Column({ nullable: true, type: 'text' })
  strValue?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  createTime!: Date;
}
