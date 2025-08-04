/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/no-null */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import type { Constructor } from '../types';
import type { ApiPropertyOptions } from '@nestjs/swagger';



interface IFieldOptions {
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
}

interface INumberFieldOptions extends IFieldOptions {
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

type IClassFieldOptions = IFieldOptions;
type IBooleanFieldOptions = IFieldOptions;
type IEnumFieldOptions = IFieldOptions;

function convertRequiredToBoolean(required: boolean | string[] | undefined): boolean | undefined {
  if (typeof required === 'boolean') {
    return required;
  }
  if (Array.isArray(required)) {
    return required.length > 0;
  }
  return required !== false;
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'numeric', ...options }),
    Type(() => Number),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(ApiProperty({ 
      type: Number, 
      required: convertRequiredToBoolean(required),
      ...restOptions 
    }));
  }

  if (options.each) {
    decorators.push(IsArray());
  }

  if (options.int) {
    decorators.push(IsInt({ each: options.each }));
  } else {
    decorators.push(IsNumber({}, { each: options.each }));
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each: options.each }));
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each: options.each }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    NumberField({ required: false, ...options }),
  );
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'varchar', ...options }),
    Type(() => String),
    IsString({ each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({ type: String, required: convertRequiredToBoolean(required), ...restOptions, isArray: options.each }),
    );
  }

  const minLength = options.minLength || 1;

  decorators.push(MinLength(minLength, { each: options.each }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    StringField({ required: false, ...options }),
  );
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'boolean', ...options }),
    Transform(({ value }) => Boolean(value)),
    IsBoolean(),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(ApiProperty({ type: Boolean, required: convertRequiredToBoolean(required), ...restOptions }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IBooleanFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    BooleanField({ required: false, ...options }),
  );
}

export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  const enumValue = getEnum();

  const decorators = [
    Column({ type: 'enum', enum: enumValue, ...options }),
    IsEnum(enumValue, { each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        enum: enumValue,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type'> & IClassFieldOptions = {},
): PropertyDecorator {
  const classValue = getClass();

  const decorators = [
    Column({ type: 'json', ...options }),
    Type(() => classValue),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: classValue,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    EnumField(getEnum, { required: false, ...options }),
  );
}

export function ClassFieldOptional<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IClassFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    ClassField(getClass, { required: false, ...options }),
  );
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'varchar', ...options }),
    Type(() => String),
    IsEmail({}, { each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: String,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    EmailField({ required: false, ...options }),
  );
}

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'varchar', ...options }),
    Type(() => String),
    IsString({ each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: String,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    PhoneField({ required: false, ...options }),
  );
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'uuid', ...options }),
    Type(() => String),
    IsUUID(undefined, { each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: String,
        format: 'uuid',
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    UUIDField({ required: false, ...options }),
  );
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'varchar', ...options }),
    Type(() => String),
    IsUrl({}, { each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: String,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    URLField({ required: false, ...options }),
  );
}

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'timestamp with time zone', ...options }),
    Type(() => Date),
    IsDate({ each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    const { required, ...restOptions } = options;
    decorators.push(
      ApiProperty({
        type: Date,
        required: convertRequiredToBoolean(required),
        ...restOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    DateField({ required: false, ...options }),
  );
}

export function IotDataField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'jsonb' }),
    Type(() => Object),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: Object,
        required: false,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField({ ...options, minLength: 6 })];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    PasswordField({ required: false, ...options }),
  );
}

export function TranslationsField(
  options: Omit<ApiPropertyOptions, 'isArray'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Column({ type: 'json' }),
    Type(() => Object),
  ];

  if (options.nullable) {
    decorators.push(IsOptional());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: 'array',
        required: false,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function TranslationsFieldOptional(
  options: Omit<ApiPropertyOptions, 'isArray'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    Column({ nullable: true }),
    TranslationsField({ required: false, ...options }),
  );
}
