import type { Type } from '@nestjs/common';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { PageDto } from '../common/dto/page.dto';

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
    ApiResponse({
      status: HttpStatus.OK,
      description: options.description,
      type: options.type,
    }),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
}
