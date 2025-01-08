import { ApiProperty } from '@nestjs/swagger';

import { ClassField } from '../../decorators';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true, type: () => [Object] })
  readonly data: T[];

  @ApiProperty({
    type: () => PageMetaDto,
  })
  @ClassField(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
