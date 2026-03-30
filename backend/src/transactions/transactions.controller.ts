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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

interface AuthUser {
  id: number;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll(
    @Request() req: { user: AuthUser },
    @Query() filter: FilterTransactionDto,
  ) {
    return this.service.findAll(req.user.id, filter);
  }

  @Get(':id')
  findOne(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id, req.user.id);
  }

  @Post()
  create(
    @Request() req: { user: AuthUser },
    @Body() dto: CreateTransactionDto,
  ) {
    return this.service.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: AuthUser },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
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
