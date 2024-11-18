import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { TaiKhoanEntity } from './tai-khoan.entity';

@Injectable()
export class TaiKhoanService {
  constructor(
    @InjectRepository(TaiKhoanEntity)
    private taiKhoanRepository: Repository<TaiKhoanEntity>,
  ) {}

  findOne(
    findData: FindOptionsWhere<TaiKhoanEntity>,
  ): Promise<TaiKhoanEntity | null> {
    return this.taiKhoanRepository.findOneBy(findData);
  }

  generatePasswordHash(password: string): string {
    // select password(`password`) from tai_khoan where username = ${username}
    this.taiKhoanRepository.query(`select password(${password})`);

    return password;
  }
}
