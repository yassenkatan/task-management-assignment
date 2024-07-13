import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskModel } from '../models/update-task.model';
import { TaskModel } from '../entities/task.entity';
import { CreateTaskModel } from '../models/create-task.model';
import { PageOptionsModel } from '../../common/pagination/models/page-options.model';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';
import {
  TaskResponseForAdminModel,
  TaskResponseForClientModel,
} from '../models/task-response.model';
import { TaskRepository } from '../repositories/task.repository';
import { UserService } from '../../user/services/user.service';
import { UserModel } from '../../user/entities/user.entity';
import { TaskStatus } from '../enums/status.enum';
import { UserResponseForAdminDto, UserResponseForClientDto } from '../../user/dto/user-response.dto';
import { TaskAssignedEventPayload, TaskCompletedEventPayload } from '../../common/event/models/event.payload';
import { EventTypes } from '../../common/event/models/event.enum';
import { EventService } from '../../common/event/event.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userService: UserService,
    private readonly eventEmitter: EventService,
  ) {}

  async createNewTask(
    createTaskModel: CreateTaskModel,
  ): Promise<TaskModel> {
    return await this.taskRepository.create({
      name: createTaskModel.name,
      description: createTaskModel.description,
    });
  }

  async checkIfFindTaskByIdAndGetIt(id: string): Promise<TaskModel> {
    const task: TaskModel = await this.taskRepository.getById(
      id,
    );
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return task;
  }

  async getAllTasks(userId?: string, status?: TaskStatus, search?: string, pageOptionsDto?: PageOptionsModel): Promise<{
    response: TaskModel[];
    meta: PageMetaModel;
  }> {
    return await this.taskRepository.getAll(userId, status, search, pageOptionsDto);
  }

  async getUserTasks(userId: string, pageOptionsDto?: PageOptionsModel): Promise<{
    response: TaskModel[];
    meta: PageMetaModel;
  }> {
     return await this.taskRepository.getAll(userId, undefined, undefined, pageOptionsDto);
  }

  async updateTask(
    id: string,
    updateTaskModel: UpdateTaskModel,
  ): Promise<TaskModel> {
    const task: TaskModel = await this.checkIfFindTaskByIdAndGetIt(id);
    task.name = updateTaskModel?.name;
    task.description = updateTaskModel?.description;
    return await this.taskRepository.update(task);
  }

  async assignUserToTask(
     userId: string,
     taskId: string,
  ): Promise<TaskModel> {
     let user: UserModel = await this.userService.checkIfUserFindByIdAndGetIt(
       userId,
     );
     let task: TaskModel = await this.checkIfFindTaskByIdAndGetIt(taskId);
     task.userId = user.id;
     task.assignedDate = new Date();
     task = await this.taskRepository.update(task);

     // send email to assigned user
     const payload: TaskAssignedEventPayload = {
      task: task,
    };
     this.eventEmitter.emit(EventTypes.TaskAssigned, payload);
     return task;
  }

  async changeTaskStatus(
    userId: string,
    status: TaskStatus,
    taskId: string,
 ): Promise<TaskModel> {
    let task: TaskModel = await this.checkIfFindTaskByIdAndGetIt(taskId);
    if(task.userId !== userId) {
      throw new BadRequestException("Cannot change the task because doesn't assigned to this user");
    }

    if(task.status == TaskStatus.ToDo && status == TaskStatus.Completed) {
      throw new BadRequestException("Cannot change the task from ToDo to completed");
    }
    task.status = status;
    if(status == TaskStatus.Completed) {
      task.completedDate = new Date();

      // send email to admin user
      const payload: TaskCompletedEventPayload = {
        task: task,
      };

      this.eventEmitter.emit(EventTypes.TaskCompleted, payload);
    }
    task = await this.taskRepository.update(task);
    return task;
 }

  async deleteTask(id: string): Promise<string> {
    const task: TaskModel = await this.checkIfFindTaskByIdAndGetIt(id);
    if (task?.userId) {
      throw new BadRequestException("Task has a user");
    }
    return await this.taskRepository.softDelete(task);
  }

  async makeTaskResponseForClient(
    task: TaskModel,
  ): Promise<TaskResponseForClientModel> {
    const user: UserResponseForClientDto = await this.userService.makeUserResponseForClient(task?.user);
    return new TaskResponseForClientModel(task, user);
  }

  async makeTaskResponseForAdmin(
    task: TaskModel,
  ): Promise<TaskResponseForAdminModel> {
    const user: UserResponseForAdminDto = await this.userService.makeUserResponseForAdmin(task?.user);
    return new TaskResponseForAdminModel(task, user);
  }

  async makeAllTasksResponseForClient(
    tasks: TaskModel[],
  ): Promise<TaskResponseForClientModel[]> {
    const tasksResponse: TaskResponseForClientModel[] = [];
    for (let i = 0; i < tasks?.length; i++) {
      const task: TaskModel = tasks[i];
      const P = await this.makeTaskResponseForClient(task);
      tasksResponse.push(P);
    }
    return tasksResponse;
  }

  async makeAllTasksResponseForAdmin(
    tasks: TaskModel[],
  ): Promise<TaskResponseForAdminModel[]> {
    const tasksResponse: TaskResponseForAdminModel[] = [];
    for (let i = 0; i < tasks?.length; i++) {
      const task: TaskModel = tasks[i];
      const P: TaskResponseForAdminModel = await this.makeTaskResponseForAdmin(task);
      tasksResponse.push(P);
    }
    return tasksResponse;
  }
}
