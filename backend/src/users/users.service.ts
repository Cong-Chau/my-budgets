import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const account = await this.prisma.account.upsert({
      where: { userId },
      update: { name: dto.name },
      create: { userId, name: dto.name },
    });
    return { id: userId, name: account.name };
  }

  async completeOnboarding(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isFirstTime: false },
    });
    return { ok: true };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Mật khẩu hiện tại không đúng');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return { message: 'Đổi mật khẩu thành công' };
  }
}
