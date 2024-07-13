import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskModel } from '../models/create-task.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto extends CreateTaskModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
