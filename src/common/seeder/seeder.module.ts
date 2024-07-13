import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { PrismaModule } from '../services/prisma/prisma.module';
import { UserRepository } from '../../user/repositories/user.repository';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, SeederService, BcryptService],
})
export class SeederModule {}
