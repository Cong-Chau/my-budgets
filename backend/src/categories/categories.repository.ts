import { Injectable } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, type?: CategoryType) {
    return this.prisma.category.findMany({
      where: { userId, ...(type && { type }) },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.category.findFirst({ where: { id, userId } });
  }

  create(data: { name: string; type: CategoryType; userId: number }) {
    return this.prisma.category.create({ data });
  }

  update(
    id: number,
    userId: number,
    data: { name?: string; type?: CategoryType },
  ) {
    return this.prisma.category.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
