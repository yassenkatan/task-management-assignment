import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { ClientAuthController } from '../controllers/client-auth.controller';
import { JwtTokenService } from '../../common/services/jwt/jwt.service';
import { EnvironmentConfigService } from '../../common/config/environment-config/environment-config.service';
import { EventService } from '../../common/event/event.service';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientAuthController],
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
export class ClientAuthModule {}
