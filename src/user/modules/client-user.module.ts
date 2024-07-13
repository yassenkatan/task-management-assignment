import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { UserService } from '../services/user.service';
import { ClientUserController } from '../controllers/client-user.controller';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ClientUserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class ClientUserModule {}
