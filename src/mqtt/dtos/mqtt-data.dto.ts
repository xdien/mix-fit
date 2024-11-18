import {
  DateField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../decorators';

export class MqttDataDto {
  @UUIDField()
  dataId!: string;

  @StringField()
  deviceId!: string;

  @NumberFieldOptional()
  value!: number;

  @StringFieldOptional()
  strValue?: string;

  @DateField()
  createTime!: Date;
}
