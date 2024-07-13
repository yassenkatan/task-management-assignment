import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { PageOptionsModel } from '../../common/pagination/models/page-options.model';
import { PageMetaDto } from '../../common/pagination/dto/pagination-meta.dto';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';
import { TaskModel } from '../entities/task.entity';
import { TaskStatus } from '../enums/status.enum';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    task: TaskModel,
  ): Promise<TaskModel> {
    return await this.prismaService.task.create({
      data: {
        name: task?.name,
        description: task?.description,
        status: TaskStatus.ToDo,
      },
      include: {
        user: true,
      }
    });
  }

  async getById(id: string): Promise<TaskModel> {
    return await this.prismaService.task.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        user: true,
      }
    });
  }

  async getAll(userId?: string, status?: TaskStatus, search?: string, pageOptionsDto?: PageOptionsModel): Promise<{
    response: TaskModel[];
    meta: PageMetaModel;
  }> {
    pageOptionsDto.skip = Number(pageOptionsDto?.page - 1) * Number(pageOptionsDto?.limit);
    const Tasks = await this.prismaService.task.findMany({
      where: {
        AND: {
          isDeleted: false,
          OR: {
            userId: userId,
            status: status,
            name: {
              contains: search,
            },
            description: {
              contains: search,
            }
          }
        }
      },
      include: {
        user: true,
      },
      skip: Number(pageOptionsDto?.skip),
      take: Number(pageOptionsDto?.limit),
      orderBy: {
        createdAt: pageOptionsDto?.order,
      },
    });

    const itemCount: number = await this.prismaService.task.count({
      where: {
        AND: {
          isDeleted: false,
          OR: {
            userId: userId,
            status: status,
            name: {
              contains: search,
            },
            description: {
              contains: search,
            }
          }
        }
      },
    });

    const pageMetaDto: PageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount,
    });

    return {
      response: Tasks,
      meta: pageMetaDto,
    };
  }

  async update(
    task: TaskModel,
  ): Promise<TaskModel> {
    return await this.prismaService.task.update({
      where: {
        id: task.id,
      },
      data: {
        name: task?.name,
        description: task?.description,
        userId : task.userId,
        status: task?.status,
        assignedDate: task?.assignedDate,
        completedDate: task?.completedDate,
        updatedAt: new Date(),
      },
      include: {
        user: true,
      }
    });
  }

  async delete(Task: TaskModel): Promise<string> {
    await this.prismaService.task.delete({
      where: {
        id: Task?.id,
      },
    });
    return `Task deleted`;
  }

  async softDelete(Task: TaskModel): Promise<string> {
    await this.prismaService.task.update({
      where: {
        id: Task?.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    return `Task deleted`;
  }
}
