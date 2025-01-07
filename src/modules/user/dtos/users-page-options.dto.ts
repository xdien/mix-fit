import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class UsersPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  readonly page: number = 1;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  readonly take: number = 10;
}
