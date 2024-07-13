import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { TaskResponseForClientDto } from '../dto/task-response.dto';
import { PageOptionsDto } from '../../common/pagination/dto/pagination-options.dto';
import { TaskResponseForAdminModel, TaskResponseForClientModel } from '../models/task-response.model';
import { PageMetaDto } from '../../common/pagination/dto/pagination-meta.dto';
import { User } from '../../common/decorators/user.decorator';
import { PageDto } from '../../common/pagination/dto/pagination.dto';
import { UserRole } from '../../user/enums/user-role.enum';
import { UserResponseForAdminDto } from '../../user/dto/user-response.dto';
import { ChangeTaskStatusDto } from '../dto/change-task-status.dto';
import { TaskModel } from '../entities/task.entity';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';

@ApiTags('Task')
@Auth(UserRole.User)
@Controller('client/task')
export class ClientTaskController {
  constructor(private readonly taskService: TaskService) {}

  @Put('change-task-status')
   @ApiOperation({
     summary: 'Change task status',
     description: 'Change task status',
   })
   @ApiOkResponse({ type: UserResponseForAdminDto })
   async changeTaskStatus(
    @User('id')
    id: string,
     @Body() changeTaskStatusDto: ChangeTaskStatusDto,
   ): Promise<TaskResponseForAdminModel> {
     const task: TaskModel = await this.taskService.changeTaskStatus(
      id,
      changeTaskStatusDto?.status,
      changeTaskStatusDto?.taskId,
     );

     return await this.taskService.makeTaskResponseForAdmin(task);
   }
   
  @Get('my-tasks')
  @ApiOperation({
    summary: 'Get my tasks',
    description: 'Get my tasks',
  })
  @ApiOkResponse({ type: [TaskResponseForClientDto] })
  async getMyTasks(
    @User('id') userId: string,
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: TaskResponseForClientModel[];
    meta: PageMetaDto;
  }> {
    const products: {
      response: TaskModel[],
      meta: PageMetaModel,
    } = await this.taskService.getUserTasks(
      userId,
      pageOptionsDto,
    );

    const response: TaskResponseForClientModel[] = await this.taskService.makeAllTasksResponseForClient(
      products?.response,
    );
    const pagination: PageDto<TaskResponseForClientModel> = new PageDto(response, products?.meta);
    return {
      response: pagination?.response,
      meta: pagination?.meta,
    };
  }
}
