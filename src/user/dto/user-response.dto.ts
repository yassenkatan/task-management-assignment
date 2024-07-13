import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import {
  UserResponseForAdminModel,
  UserResponseForClientModel,
} from '../models/user-response.model';
import { TaskResponseForAdminDto, TaskResponseForClientDto } from 'src/task/dto/task-response.dto';
import { TaskResponseForAdminModel, TaskResponseForClientModel } from 'src/task/models/task-response.model';



export class UserResponseForAdminDto extends UserResponseForAdminModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName?: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ enumName: 'UserRole', enum: UserRole })
  userRole: UserRole;
  @ApiProperty()
  lastLogin?: Date;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
}

export class UserResponseForClientDto extends UserResponseForClientModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName?: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email: string;
}
