import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: number, dateFrom?: string, dateTo?: string) {
    const dateFilter = {
      ...(dateFrom && { gte: new Date(dateFrom) }),
      ...(dateTo && { lte: new Date(dateTo) }),
    };

    const where = {
      userId,
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<number, { name: string; total: number }> = {};
    const cashflowMap: Record<string, { income: number; expense: number }> = {};

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      const dateKey = tx.date.toISOString().slice(0, 10); // YYYY-MM-DD

      if (tx.type === 'INCOME') {
        totalIncome += amount;
      } else {
        totalExpense += amount;

        const catId = tx.categoryId;
        if (!categoryMap[catId]) {
          categoryMap[catId] = { name: tx.category.name, total: 0 };
        }
        categoryMap[catId].total += amount;
      }

      if (!cashflowMap[dateKey])
        cashflowMap[dateKey] = { income: 0, expense: 0 };
      if (tx.type === 'INCOME') cashflowMap[dateKey].income += amount;
      else cashflowMap[dateKey].expense += amount;
    }

    const expenseByCategory = Object.values(categoryMap).map((c) => ({
      name: c.name,
      value: parseFloat(c.total.toFixed(2)),
    }));

    const cashflow = Object.entries(cashflowMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { income, expense }]) => ({
        month: date,
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
      }));

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      balance: parseFloat((totalIncome - totalExpense).toFixed(2)),
      expenseByCategory,
      cashflow,
    };
  }
}
