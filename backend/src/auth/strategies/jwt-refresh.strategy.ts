import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET') as string,
      passReqToCallback: true as const,
    });
  }

  validate(req: Request, payload: { sub: number; email: string }) {
    const refreshToken = (req.body as { refreshToken?: string })?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}
