import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { TokenPayload } from '../../auth/models/token-payload.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: EnvironmentConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authService.validateUserForJWTStrategy(
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
