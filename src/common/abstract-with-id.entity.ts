import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LanguageCode } from '../constants';
import type { Constructor } from '../types';
import type {
  AbstractTranslationDto,
  AbstractWithIdDto,
} from './dto/abstract-with-id.dto';

/**
 * Abstract Entity
 * @author Narek Hakobyan <narek.hakobyan.07@gmail.com>
 *
 * @description This class is an abstract class for all entities.
 * It's experimental and recommended using it only in microservice architecture,
 * otherwise just delete and use your own entity.
 */
export abstract class AbstractWithIdEntity<
  DTO extends AbstractWithIdDto = AbstractWithIdDto,
  O = never,
> {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt!: Date;

  translations?: AbstractTranslationEntity[];

  private dtoClass?: Constructor<DTO, [AbstractWithIdEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}

export class AbstractTranslationEntity<
  DTO extends AbstractTranslationDto = AbstractTranslationDto,
  O = never,
> extends AbstractWithIdEntity<DTO, O> {
  @Column({ type: 'enum', enum: LanguageCode })
  languageCode!: LanguageCode;
}
