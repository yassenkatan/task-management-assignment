import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "../enums/status.enum";
import { IsNotEmpty } from "class-validator";

export class ChangeTaskStatusDto {
    @ApiProperty({enum: TaskStatus, enumName: 'status'})
    @IsNotEmpty()
    status: TaskStatus;
    @ApiProperty()
    @IsNotEmpty()
    taskId: string;
}