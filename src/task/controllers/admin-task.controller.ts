import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/pagination/dto/pagination-options.dto';
import { PageDto } from '../../common/pagination/dto/pagination.dto';
import { PageMetaDto } from '../../common/pagination/dto/pagination-meta.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../user/enums/user-role.enum';
import { UserResponseForAdminDto } from '../../user/dto/user-response.dto';
import { TaskService } from '../services/task.service';
import { TaskResponseForAdminDto } from '../dto/task-response.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseForAdminModel } from '../models/task-response.model';
import { AssignTaskToUserDto } from '../dto/assign-user-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../enums/status.enum';
import { TaskModel } from '../entities/task.entity';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';

@ApiTags('Task')
@Auth(UserRole.Admin)
@Controller('dashboard/task')
export class AdminTaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new task',
    description: 'Create new task',
  })
  @ApiOkResponse({ type: TaskResponseForAdminDto })
  async createNewTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseForAdminModel> {
    const task: TaskModel = await this.taskService.createNewTask(
      createTaskDto,
    );
    return await this.taskService.makeTaskResponseForAdmin(task);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Get all tasks',
  })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: [TaskResponseForAdminDto] })
  async getAllTasks(
    @Query('userId')
    userId?: string,
    @Query('status')
    status?: TaskStatus,
    @Query('search')
    search?: string,
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: TaskResponseForAdminModel[];
    meta: PageMetaDto;
  }> {
    const tasks: {
      response: TaskModel[],
      meta: PageMetaModel,
    } = await this.taskService.getAllTasks(userId, status, search, pageOptionsDto);

    const response: TaskResponseForAdminModel[] = await this.taskService.makeAllTasksResponseForAdmin(
      tasks?.response,
    );
    const pagination: PageDto<TaskResponseForAdminModel> = new PageDto(response, tasks?.meta);
    return {
      response: pagination?.response,
      meta: pagination?.meta,
    };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get task by Id',
    description: 'Get task by Id',
  })
  @ApiOkResponse({ type: TaskResponseForAdminDto })
  async getTaskById(
    @Param('id') id: string,
  ): Promise<TaskResponseForAdminModel> {
    const task: TaskModel = await this.taskService.checkIfFindTaskByIdAndGetIt(id);
    
    return await this.taskService.makeTaskResponseForAdmin(task);
  }

  @Put('assign-task')
   @ApiOperation({
     summary: 'Assign task to user',
     description: 'Assign task to user',
   })
   @ApiOkResponse({ type: UserResponseForAdminDto })
   async assignTasksToUser(
     @Body() assignTasksToUserDto: AssignTaskToUserDto,
   ): Promise<TaskResponseForAdminModel> {
     const task: TaskModel = await this.taskService.assignUserToTask(
       assignTasksToUserDto?.userId,
       assignTasksToUserDto?.taskId,
     );
     return await this.taskService.makeTaskResponseForAdmin(task);
   }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update Task',
    description: 'Update Task',
  })
  @ApiOkResponse({ type: TaskResponseForAdminDto })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseForAdminModel> {
    const Task: TaskModel = await this.taskService.updateTask(
      id,
      updateTaskDto,
    );
    return await this.taskService.makeTaskResponseForAdmin(Task);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete Task',
    description: 'Delete Task',
  })
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }
}
