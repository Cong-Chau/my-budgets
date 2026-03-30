import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface AuthUser {
  id: number;
  email: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  updateProfile(
    @Request() req: { user: AuthUser },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('onboarding')
  @HttpCode(HttpStatus.OK)
  completeOnboarding(@Request() req: { user: AuthUser }) {
    return this.usersService.completeOnboarding(req.user.id);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Request() req: { user: AuthUser },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user.id, dto);
  }
}
