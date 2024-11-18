import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { Constructor } from '../types';
import type { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> {
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt!: Date;

  private dtoClass?: Constructor<DTO, [AbstractEntity, O?]>;

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
