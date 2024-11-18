import { Expose, Transform } from 'class-transformer';

export class MqttDataDto {
  @Expose({ name: 'type' })
  @Transform(({ value }): string => value)
  type!: string;
}
