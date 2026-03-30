import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards/jwt.guard';

interface AuthUser {
  id: number;
  email: string;
  refreshToken?: string;
}

function getUser(req: { user: AuthUser }) {
  return req.user;
}

import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  refresh(@Request() req: { user: AuthUser }) {
    const user = getUser(req);
    return this.authService.refreshTokens(user.id, user.refreshToken!);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: { user: AuthUser }) {
    return this.authService.logout(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: { user: AuthUser }) {
    return this.authService.getMe(req.user.id);
  }
}
