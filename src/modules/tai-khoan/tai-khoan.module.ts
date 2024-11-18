import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaiKhoanController } from './tai-khoan.controller';
import { TaiKhoanEntity } from './tai-khoan.entity';
import { TaiKhoanService } from './tai-khoan.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaiKhoanEntity])],
  controllers: [TaiKhoanController],
  exports: [TaiKhoanService],
  providers: [TaiKhoanService],
})
export class TaiKhoanModule {}
