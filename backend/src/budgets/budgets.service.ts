import { Injectable, NotFoundException } from '@nestjs/common';
import { BudgetsRepository } from './budgets.repository';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly repo: BudgetsRepository) {}

  findAll(userId: number) {
    return this.repo.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const budget = await this.repo.findOne(id, userId);
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  create(userId: number, dto: CreateBudgetDto) {
    return this.repo.create({ ...dto, userId });
  }

  async update(id: number, userId: number, dto: UpdateBudgetDto) {
    await this.findOne(id, userId);
    return this.repo.update(id, dto);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.repo.delete(id);
  }
}
