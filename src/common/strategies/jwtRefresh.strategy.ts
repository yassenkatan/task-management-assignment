import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { TokenPayload } from '../../auth/models/token-payload.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: EnvironmentConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.['refresh-token'] as string;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(_request: Request, payload: TokenPayload) {
    const user = await this.authService.validateUserForJWTStrategy(
      payload?.email,
    );

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
