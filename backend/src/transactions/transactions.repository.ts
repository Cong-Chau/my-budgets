import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface FindAllOptions {
  userId: number;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  type?: TransactionType;
}

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ userId, dateFrom, dateTo, categoryId, type }: FindAllOptions) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
    };

    return this.prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, type: true } } },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true, type: true } } },
    });
  }

  create(data: {
    amount: number;
    type: TransactionType;
    categoryId: number;
    userId: number;
    date: Date;
    note?: string;
  }) {
    return this.prisma.transaction.create({
      data,
      include: { category: { select: { id: true, name: true, type: true } } },
    });
  }

  update(
    id: number,
    data: {
      amount?: number;
      type?: TransactionType;
      categoryId?: number;
      date?: Date;
      note?: string;
    },
  ) {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, type: true } } },
    });
  }

  delete(id: number) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
