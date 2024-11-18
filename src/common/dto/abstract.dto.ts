// import type { AbstractEntity } from 'common/abstract.entity';

import { DateFieldOptional } from '../../decorators';

export class AbstractDto {
  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  //   constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
  // if (!options?.excludeFields) {
  //   this.createdAt = entity.createdAt;
  //   this.updatedAt = entity.updatedAt;
  // }
  //   }
}
