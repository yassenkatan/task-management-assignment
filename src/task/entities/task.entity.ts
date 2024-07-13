import { Type } from "class-transformer";
import { BaseEntity } from "src/common/base/base.entty";
import { UserModel } from "src/user/entities/user.entity";
import { TaskStatus } from "../enums/status.enum";

export class TaskModel extends BaseEntity {
  name: string;
  description?: string;
  userId?: string;
  assignedDate?: Date;
  completedDate?: Date;
  status?: TaskStatus;
  @Type(() => UserModel)
  user?: UserModel;
}
