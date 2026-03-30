import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DashboardService } from './dashboard.service';

interface AuthUser {
  id: number;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  getSummary(
    @Request() req: { user: AuthUser },
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.getSummary(req.user.id, dateFrom, dateTo);
  }
}
