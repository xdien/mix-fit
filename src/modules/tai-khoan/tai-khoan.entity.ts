import { Column, Entity } from 'typeorm';

import { UseDto } from '../../decorators';
import { TaiKhoanDto } from './dtos/tai-khoan.dto';

@Entity({ name: 'TAI_KHOAN' })
@UseDto(TaiKhoanDto)
export class TaiKhoanEntity {
  @Column({ primary: true, nullable: false, type: 'int', name: 'USERID' })
  userId!: string;

  @Column({ unique: true, nullable: false, type: 'varchar', name: 'USERNAME' })
  username!: string;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'PASSWORD',
  })
  password!: string;

  @Column({ nullable: false, type: 'varchar', name: 'TEN_NV' })
  tenNv!: string;

  @Column({ nullable: true, type: 'varchar', name: 'GHI_CHU' })
  ghiChu?: string;

  @Column({ nullable: true, type: 'varchar', name: 'GIOI_TINH' })
  gioiTinh!: string;

  @Column({ nullable: true, type: 'varchar', name: 'DIA_CHI_NV' })
  diaChiNv!: string;

  @Column({ nullable: true, type: 'varchar', name: 'TEL' })
  tel?: string;

  @Column({ nullable: true, type: 'varchar', name: 'SO_GIAY_UY_QUYEN' })
  soGiayUyQuyen?: string;

  @Column({ nullable: true, type: 'bool', name: 'IS_DUOC_UY_QUYEN' })
  isDuocUyQuyen?: boolean;

  @Column({ nullable: true, type: 'varchar', name: 'TEN_CHUC_VU' })
  tenChucVu?: string;

  @Column({ nullable: true, type: 'bool', name: 'DA_NGHI' })
  daNghi!: boolean;

  @Column({ nullable: true, type: 'varchar', name: 'REALM' })
  realm?: string;

  @Column({ nullable: true, type: 'varchar', name: 'EMAIL' })
  email?: string;

  @Column({ nullable: true, type: 'varchar', name: 'EMAILVERIFIED' })
  emailVerified?: string;

  @Column({ nullable: true, type: 'varchar', name: 'VERIFICATIONTOKEN' })
  verificationToken?: string;

  @Column({ nullable: true, type: 'int', name: 'KHOID' })
  khoId!: string;

  @Column({ nullable: true, type: 'varchar', name: 'OPTION1' })
  option1?: string;

  @Column({ nullable: true, type: 'varchar', name: 'OPTION2' })
  option2?: string;

  @Column({ nullable: true, type: 'varchar', name: 'OPTION3' })
  option3?: string;

  @Column({ nullable: true, type: 'varchar', name: 'OPTION4' })
  option4?: string;

  //   @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  //   settings?: UserSettingsEntity;
}
