import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractWithIdEntity } from '../../common/abstract-with-id.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { PostDto } from './dtos/post.dto';
import { PostTranslationEntity } from './post-translation.entity';

@Entity({ name: 'posts' })
@UseDto(PostDto)
export class PostEntity extends AbstractWithIdEntity<PostDto> {
  @Column({ type: 'uuid' })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToMany(
    () => PostTranslationEntity,
    (postTranslationEntity) => postTranslationEntity.post,
  )
  declare translations?: PostTranslationEntity[];
}
