import { TaskModel } from "src/task/entities/task.entity";
import { UserModel } from "src/user/entities/user.entity";

export class TaskAssignedEventPayload {
  task: TaskModel;
}

export class TaskCompletedEventPayload {
  task: TaskModel;
}
