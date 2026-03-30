import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        account: { create: { name: dto.name } },
      },
      include: { account: true },
    });

    await this.createDefaultCategories(user.id);

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, name: user.account?.name },
      ...tokens,
    };
  }

  private async createDefaultCategories(userId: number) {
    const defaults = [
      // Thu nhập
      { name: 'Lương', type: 'INCOME' as const },
      { name: 'Freelance', type: 'INCOME' as const },
      { name: 'Đầu tư', type: 'INCOME' as const },
      { name: 'Thưởng', type: 'INCOME' as const },
      // Chi tiêu
      { name: 'Thực phẩm', type: 'EXPENSE' as const },
      { name: 'Nhà ở', type: 'EXPENSE' as const },
      { name: 'Di chuyển', type: 'EXPENSE' as const },
      { name: 'Giải trí', type: 'EXPENSE' as const },
      { name: 'Mua sắm', type: 'EXPENSE' as const },
      { name: 'Sức khỏe', type: 'EXPENSE' as const },
    ];
    await this.prisma.category.createMany({
      data: defaults.map((c) => ({ ...c, userId })),
      skipDuplicates: true,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { account: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, name: user.account?.name },
      ...tokens,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        account: { select: { name: true } },
      },
    });
    return {
      id: user?.id,
      email: user?.email,
      name: user?.account?.name,
      createdAt: user?.createdAt,
    };
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
