import { UserResponseForAdminDto, UserResponseForClientDto } from '../../user/dto/user-response.dto';
import {
  TaskResponseForAdminModel,
  TaskResponseForClientModel,
} from '../models/task-response.model';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/status.enum';

export class TaskResponseForAdminDto extends TaskResponseForAdminModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({nullable: true, type: () => UserResponseForAdminDto})
  user?: UserResponseForAdminDto;
  @ApiProperty({enum: TaskStatus, enumName:'status'})
  status?: TaskStatus;
  @ApiProperty()
  assignedDate?: Date;
  @ApiProperty()
  completedDate?: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class TaskResponseForClientDto extends TaskResponseForClientModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({nullable: true, type: () => UserResponseForClientDto})
  user?: UserResponseForClientDto;
  @ApiProperty({enum: TaskStatus, enumName:'status'})
  status?: TaskStatus;
  @ApiProperty()
  assignedDate?: Date;
  @ApiProperty()
  completedDate?: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
