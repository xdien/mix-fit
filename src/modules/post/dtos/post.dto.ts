import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';
import { DynamicTranslate, StaticTranslate } from '../../../decorators';
import type { PostEntity } from '../post.entity';
import { PostTranslationDto } from './post-translation.dto';

export class PostDto extends AbstractWithIdDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  @ApiPropertyOptional({ type: PostTranslationDto, isArray: true })
  declare translations?: PostTranslationDto[];

  constructor(postEntity: PostEntity) {
    super(postEntity);

    this.info = 'keywords.admin';
  }
}
