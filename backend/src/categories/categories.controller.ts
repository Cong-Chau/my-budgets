import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

interface AuthUser {
  id: number;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll(
    @Request() req: { user: AuthUser },
    @Query('type') type?: CategoryType,
  ) {
    return this.service.findAll(req.user.id, type);
  }

  @Get(':id')
  findOne(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id, req.user.id);
  }

  @Post()
  create(@Request() req: { user: AuthUser }, @Body() dto: CreateCategoryDto) {
    return this.service.create(req.user.id, dto);
  }

  @Post('bulk')
  createBulk(
    @Request() req: { user: AuthUser },
    @Body() body: { categories: CreateCategoryDto[] },
  ) {
    return this.service.createBulk(req.user.id, body.categories);
  }

  @Patch(':id')
  update(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id, req.user.id);
  }
}
