import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({ usernameField: 'email' } as IStrategyOptions);
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException("Unauthenticated");
    }

    const user = await this.authService.validateUserForLocalStrategy(
      email,
      password,
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
