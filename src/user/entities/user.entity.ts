import { TaskModel } from "src/task/entities/task.entity";
import { UserRole } from "../enums/user-role.enum";
import { Type } from "class-transformer";
import { BaseEntity } from "src/common/base/base.entty";

export class UserModel extends BaseEntity {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  userRole: UserRole;
  hashRefreshToken?: string;
  lastLogin?: Date;
  @Type(() => TaskModel)
  task?: TaskModel[];
}
