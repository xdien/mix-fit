import { StringField } from './../../../decorators/field.decorators';

export class CmsLoginDto {
  @StringField()
  username!: string;

  @StringField()
  password!: string;
}
