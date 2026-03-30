import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
