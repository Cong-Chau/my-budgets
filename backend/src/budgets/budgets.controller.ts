import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

interface AuthUser {
  id: number;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly service: BudgetsService) {}

  @Get()
  findAll(@Request() req: { user: AuthUser }) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id, req.user.id);
  }

  @Post()
  create(@Request() req: { user: AuthUser }, @Body() dto: CreateBudgetDto) {
    return this.service.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBudgetDto,
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
