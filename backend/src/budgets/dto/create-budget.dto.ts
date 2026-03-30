import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class CreateBudgetDto {
  @IsInt()
  categoryId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;
}
