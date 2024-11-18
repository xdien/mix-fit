import {
  DateField,
  DYNAMIC_TRANSLATION_DECORATOR_KEY,
  UUIDField,
} from '../../decorators';
import { ContextProvider } from '../../providers';
import type { AbstractWithIdEntity } from '../abstract-with-id.entity';

export class AbstractWithIdDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  translations?: AbstractTranslationDto[];

  constructor(
    entity: AbstractWithIdEntity,
    options?: { excludeFields?: boolean },
  ) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }

    const languageCode = ContextProvider.getLanguage();

    if (languageCode && entity.translations) {
      const translationEntity = entity.translations.find(
        (titleTranslation) => titleTranslation.languageCode === languageCode,
      )!;

      const fields: Record<string, string> = {};

      for (const key of Object.keys(translationEntity)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const metadata = Reflect.getMetadata(
          DYNAMIC_TRANSLATION_DECORATOR_KEY,
          this,
          key,
        );

        if (metadata) {
          fields[key] = (translationEntity as never)[key];
        }
      }

      Object.assign(this, fields);
    } else {
      this.translations = entity.translations?.toDtos();
    }
  }
}

export class AbstractTranslationDto extends AbstractWithIdDto {
  constructor(entity: AbstractWithIdEntity) {
    super(entity, { excludeFields: true });
  }
}
