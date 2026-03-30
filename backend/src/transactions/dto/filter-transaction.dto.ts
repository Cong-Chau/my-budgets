import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class FilterTransactionDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  categoryId?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
