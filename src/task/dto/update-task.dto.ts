import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateTaskModel } from '../models/update-task.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends UpdateTaskModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
