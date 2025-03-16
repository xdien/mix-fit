/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getDataSourceByName } from 'typeorm-transactional';

import { DataSourceNameEnum } from '../constants/datasoure-name';

export function CmsTransactional() {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const dataSource = getDataSourceByName(DataSourceNameEnum.CMS);

      if (!dataSource) {
        throw new Error('CMS DataSource not found');
      }

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();

        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        await queryRunner.release();
      }
    };

    return descriptor;
  };
}
