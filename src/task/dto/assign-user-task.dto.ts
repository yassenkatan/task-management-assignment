import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskToUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
}
