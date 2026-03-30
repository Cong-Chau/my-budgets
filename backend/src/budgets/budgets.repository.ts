import { Injectable } from '@nestjs/common';
import { Budget, BudgetPeriod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getPeriodDates(period: BudgetPeriod): { start: Date; end: Date } {
    const now = new Date();
    if (period === BudgetPeriod.MONTHLY) {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      return { start, end };
    } else {
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  private async enrichBudget<T extends Budget>(budget: T) {
    const { start, end } = this.getPeriodDates(budget.period);
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId: budget.userId,
        categoryId: budget.categoryId,
        type: 'EXPENSE',
        date: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    const totalSpent = Number(result._sum.amount ?? 0);
    const amount = Number(budget.amount);
    const remaining = Math.max(0, amount - totalSpent);
    const percentage =
      amount > 0 ? Math.round((totalSpent / amount) * 1000) / 10 : 0;
    const status: 'safe' | 'warning' | 'exceeded' =
      percentage >= 100 ? 'exceeded' : percentage >= 70 ? 'warning' : 'safe';

    return { ...budget, amount, totalSpent, remaining, percentage, status };
  }

  async findAll(userId: number) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true, type: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return Promise.all(budgets.map((b) => this.enrichBudget(b)));
  }

  async findOne(id: number, userId: number) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true, type: true } } },
    });
    if (!budget) return null;
    return this.enrichBudget(budget);
  }

  async create(data: {
    userId: number;
    categoryId: number;
    amount: number;
    period: BudgetPeriod;
  }) {
    const budget = await this.prisma.budget.create({
      data,
      include: { category: { select: { id: true, name: true, type: true } } },
    });
    return this.enrichBudget(budget);
  }

  async update(
    id: number,
    data: { categoryId?: number; amount?: number; period?: BudgetPeriod },
  ) {
    const budget = await this.prisma.budget.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, type: true } } },
    });
    return this.enrichBudget(budget);
  }

  delete(id: number) {
    return this.prisma.budget.delete({ where: { id } });
  }
}
