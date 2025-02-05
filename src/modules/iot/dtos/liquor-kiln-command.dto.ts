import { ApiProperty } from '@nestjs/swagger';

import { ACTION_MAPPING } from '../device-adapter/liquor-kiln-commnad.type';

export class LiquorKilnCommandActionDto {
  @ApiProperty({
    enum: Object.keys(ACTION_MAPPING),
    description: 'Available command actions for liquor kiln',
    example: 'HEATER_1',
  })
  action: string | undefined;
}
