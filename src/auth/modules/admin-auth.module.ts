import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AdminAuthController } from '../controllers/admin-auth.controller';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';
import { EventService } from '../../common/event/event.service';
import { EnvironmentConfigService } from '../../common/config/environment-config/environment-config.service';
import { JwtTokenService } from '../../common/services/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { UserRepository } from '../../user/repositories/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminAuthController],
  providers: [
    UserRepository,
    UserService,
    AuthService,
    BcryptService,
    EventService,
    EnvironmentConfigService,
    JwtTokenService,
    JwtService,
  ],
  exports: [AuthService],
})
export class AdminAuthModule {}
