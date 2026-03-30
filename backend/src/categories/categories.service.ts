import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  findAll(userId: number, type?: CategoryType) {
    return this.repo.findAll(userId, type);
  }

  async findOne(id: number, userId: number) {
    const category = await this.repo.findOne(id, userId);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  create(userId: number, dto: CreateCategoryDto) {
    return this.repo.create({ ...dto, userId });
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
