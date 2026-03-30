import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class UpdateCategoryDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}
