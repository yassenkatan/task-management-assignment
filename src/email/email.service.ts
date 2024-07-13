import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnvironmentConfigService } from '../common/config/environment-config/environment-config.service';
import { EventTypes } from '../common/event/models/event.enum';
import { TaskAssignedEventPayload, TaskCompletedEventPayload } from '../common/event/models/event.payload';
import { MailService } from '../common/services/mail/mail.service';
import { TaskModel } from '../task/entities/task.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly config: EnvironmentConfigService,
    private readonly mailService: MailService,
  ) {}

   @OnEvent(EventTypes.TaskAssigned)
   async sendTaskAssignedMail(
    taskAssignedEventPayload: TaskAssignedEventPayload,
   ) {
     return this.sendAssignedTakMail(
      taskAssignedEventPayload?.task,
     );
   }

   @OnEvent(EventTypes.TaskCompleted)
   async sendTaskCompletedMail(
    taskCompletedEventPayload: TaskCompletedEventPayload,
   ) {
     return this.sendCompletedTaskMail(
      taskCompletedEventPayload?.task,
     );
   }

   private async sendAssignedTakMail(task: TaskModel) {
    return this.mailService.sendMail({
      from: this.config.getMailTransportUser(),
      subject: 'Task Assignment',
      to: task?.user?.email,
      template: './task-assignment-mail.template.hbs',
      context: {
        name: task?.name,
        description: task?.description,
        status: task?.status,
        assignedDate: task?.assignedDate,
      },
    });
  }

  private async sendCompletedTaskMail(task: TaskModel) {
    const adminEmail = this.config.getAdminEmail()?.toLowerCase();
    return this.mailService.sendMail({
      from: this.config.getMailTransportUser(),
      subject: 'Task Completed',
      to: adminEmail,
      template: './task-completed-mail.template.hbs',
      context: {
        name: task?.name,
        description: task?.description,
        status: task?.status,
        assignedDate: task?.assignedDate,
        completedDate: task?.completedDate,
        fullName: `${task?.user?.firstName} ${task?.user?.lastName}`
      },
    });
  }
}
