import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { AdminUserController } from '../controllers/admin-user.controller';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController],
  providers: [UserRepository, UserService, BcryptService],
  exports: [UserRepository, UserService],
})
export class AdminUserModule {}
