import 'source-map-support/register';

import { compact, map } from 'lodash';
import type { ObjectLiteral } from 'typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import type { AbstractWithIdEntity } from './common/abstract-with-id.entity';
import type { AbstractWithIdDto } from './common/dto/abstract-with-id.dto';
import type { CreateTranslationDto } from './common/dto/create-translation.dto';
import { PageDto } from './common/dto/page.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import type { PageOptionsDto } from './common/dto/page-options.dto';
import type { LanguageCode } from './constants/language-code';
import type { KeyOfType } from './types';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  export type Todo = any & { _todoBrand: undefined };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Array<T> {
    toDtos<Dto extends AbstractWithIdDto>(this: T[], options?: unknown): Dto[];

    getByLanguage(
      this: CreateTranslationDto[],
      languageCode: LanguageCode,
    ): string;

    toPageDto<Dto extends AbstractWithIdDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<Dto>;
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface SelectQueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;

    leftJoinAndSelect<
      AliasEntity extends AbstractWithIdEntity,
      A extends string,
    >(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractWithIdEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractWithIdEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractWithIdEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<
      AliasEntity extends AbstractWithIdEntity,
      A extends string,
    >(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractWithIdEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractWithIdEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractWithIdEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

Array.prototype.toDtos = function <
  Entity extends AbstractWithIdEntity<Dto>,
  Dto extends AbstractWithIdDto,
>(options?: unknown): Dto[] {
  return compact(
    map<Entity, Dto>(this as Entity[], (item) => item.toDto(options as never)),
  );
};

Array.prototype.getByLanguage = function (languageCode: LanguageCode): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return this.find((translation) => languageCode === translation.languageCode)!
    .text;
};

Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

SelectQueryBuilder.prototype.searchByString = function (
  q,
  columnNames,
  options,
) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  if (options?.formStart) {
    this.setParameter('q', `${q}%`);
  } else {
    this.setParameter('q', `%${q}%`);
  }

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const entities = await this.getMany();

  let itemCount = -1;

  if (!options?.skipCount) {
    itemCount = await this.getCount();
  }

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
