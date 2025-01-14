/* eslint-disable @typescript-eslint/naming-convention */
import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

export function ApiPageResponse<T extends Type>(options: {
  type: T;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiExtraModels(options.type),
    ApiOperation({ summary: options.description }),
    ApiQuery({
      name: 'page',
      type: 'integer',
      required: false,
      description: 'Page number',
      schema: {
        type: 'integer',
        minimum: 1,
        default: 1,
      },
    }),
    ApiQuery({
      name: 'take',
      type: 'integer',
      required: false,
      description: 'Items per page',
    }),
    ApiOkResponse({
      description: options.description,
      schema: {
        title: 'PageResponseOf' + options.type.name,
        allOf: [
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
              meta: { $ref: getSchemaPath(PageMetaDto) },
            },
          },
        ],
      },
    }),
  );
}
