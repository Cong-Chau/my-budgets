import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SummaryDto {
  @IsNumber()
  income: number;

  @IsNumber()
  expense: number;

  @IsNumber()
  balance: number;
}

export class SyncDataDto {
  @IsArray()
  transactions: any[];

  @IsArray()
  budgets: any[];

  @IsArray()
  categories: any[];

  @IsObject()
  @ValidateNested()
  @Type(() => SummaryDto)
  summary: SummaryDto;
}
