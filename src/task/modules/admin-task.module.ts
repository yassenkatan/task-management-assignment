import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { PrismaModule } from '../../common/services/prisma/prisma.module';
import { AdminTaskController } from '../controllers/admin-task.controller';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { TaskRepository } from '../repositories/task.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminTaskController],
  providers: [TaskService, UserRepository, UserService, TaskRepository],
})
export class AdminTaskModule {}
