import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  findAll(userId: number, filter: FilterTransactionDto) {
    return this.repo.findAll({ userId, ...filter });
  }

  async findOne(id: number, userId: number) {
    const tx = await this.repo.findOne(id, userId);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  create(userId: number, dto: CreateTransactionDto) {
    return this.repo.create({
      ...dto,
      userId,
      date: new Date(dto.date),
    });
  }

  async update(id: number, userId: number, dto: UpdateTransactionDto) {
    await this.findOne(id, userId);
    const { date, ...rest } = dto;
    return this.repo.update(id, {
      ...rest,
      ...(date && { date: new Date(date) }),
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.repo.delete(id);
  }
}
