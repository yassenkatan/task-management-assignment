import { UserResponseForAdminDto, UserResponseForClientDto } from 'src/user/dto/user-response.dto';
import { TaskModel } from '../entities/task.entity';
import { TaskStatus } from '../enums/status.enum';

export class TaskResponseForAdminModel {
  id: string;
  name: string;
  description?: string;
  user?: UserResponseForAdminDto;
  status?: TaskStatus;
  assignedDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(taskModel: TaskModel, user?: UserResponseForAdminDto) {
    this.id = taskModel?.id;
    this.name = taskModel?.name;
    this.description = taskModel?.description;
    this.user = user;
    this.status = taskModel?.status;
    this.assignedDate = taskModel?.assignedDate;
    this.completedDate = taskModel?.completedDate;
    this.createdAt = taskModel?.createdAt;
    this.updatedAt = taskModel?.updatedAt;
  }
}

export class TaskResponseForClientModel {
  id: string;
  name: string;
  description?: string;
  user?: UserResponseForClientDto;
  status?: TaskStatus;
  assignedDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(taskModel: TaskModel, user?: UserResponseForClientDto) {
    this.id = taskModel?.id;
    this.name = taskModel?.name;
    this.description = taskModel?.description;
    this.user = user;
    this.status = taskModel?.status;
    this.assignedDate = taskModel?.assignedDate;
    this.completedDate = taskModel?.completedDate;
    this.createdAt = taskModel?.createdAt;
    this.updatedAt = taskModel?.updatedAt;
  }
}
