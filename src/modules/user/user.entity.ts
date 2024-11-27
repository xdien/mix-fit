import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { AbstractWithIdEntity } from '../../common/abstract-with-id.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { DeviceEntity } from '../iot-control/entities/device.entity';
import { PostEntity } from '../post/post.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractWithIdEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  fullName?: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone?: string | null | undefined;

  @Column({ nullable: true, type: 'varchar' })
  avatar?: string | null | undefined;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts?: PostEntity[];

  @OneToMany(() => DeviceEntity, (deviceEntity) => deviceEntity.owner)
  devices?: DeviceEntity[];
}
