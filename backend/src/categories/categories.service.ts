import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { CategoriesRepository } from './categories.repository';
import { BudgetsService } from '../budgets/budgets.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly budgetsService: BudgetsService,
  ) {}

  async findAll(userId: number, type?: CategoryType) {
    const [categories, budgets] = await Promise.all([
      this.repo.findAll(userId, type),
      this.budgetsService.findAll(userId),
    ]);

    // Map budgets by categoryId (prefer MONTHLY, fallback to first)
    const budgetMap = new Map<number, (typeof budgets)[number]>();
    for (const b of budgets) {
      const existing = budgetMap.get(b.categoryId);
      if (!existing || b.period === 'MONTHLY') {
        budgetMap.set(b.categoryId, b);
      }
    }

    return categories.map((c) => ({
      ...c,
      budget: budgetMap.get(c.id) ?? null,
    }));
  }

  async findOne(id: number, userId: number) {
    const category = await this.repo.findOne(id, userId);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  create(userId: number, dto: CreateCategoryDto) {
    return this.repo.create({ ...dto, userId });
  }

  async createBulk(userId: number, dtos: CreateCategoryDto[]) {
    await this.repo.createMany(userId, dtos);
    return this.findAll(userId);
  }

  async update(id: number, userId: number, dto: UpdateCategoryDto) {
    await this.findOne(id, userId);
    return this.repo.update(id, userId, dto);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.repo.delete(id);
  }
}
