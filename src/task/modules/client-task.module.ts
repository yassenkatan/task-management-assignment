import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { TaskRepository } from '../repositories/task.repository';
import { ClientTaskController } from '../controllers/client-task.controller';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientTaskController],
  providers: [TaskService, UserRepository, UserService, TaskRepository],
})
export class ClientTaskModule {}
