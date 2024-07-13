import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { PageOptionsModel } from 'src/common/pagination/models/page-options.model';
import { PageMetaDto } from '../../common/pagination/dto/pagination-meta.dto';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';
import { UserModel } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: UserModel): Promise<UserModel> {
    return await this.prismaService.user.create({
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email?.toLowerCase(),
        password: user?.password,
        userRole: user.userRole,
      }
    });
  }

  async getAll(pageOptionsDto?: PageOptionsModel): Promise<{
    response: UserModel[];
    meta: PageMetaModel;
  }> {
    pageOptionsDto.skip = Number(pageOptionsDto?.page - 1) * Number(pageOptionsDto?.limit);
    const users = await this.prismaService.user.findMany({
      skip: Number(pageOptionsDto?.skip),
      take: Number(pageOptionsDto?.limit),
      orderBy: {
        createdAt: pageOptionsDto?.order,
      }
    });

    let itemCount: number = await this.prismaService.user.count({});
    const pageMetaDto: PageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount,
    });

    return {
      response: users,
      meta: pageMetaDto,
    };
  }

  async getById(id: string): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        id: id,
        isDeleted: false,
      }
    });
  }


  async getByEmail(email: string): Promise<UserModel> {
    return await this.prismaService.user.findFirst({
      where: {
        AND: {
          email: email,
          isDeleted: false,
        },
      }
    });
  }

  async update(user: UserModel): Promise<UserModel> {
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email?.toLowerCase(),
        hashRefreshToken: user?.hashRefreshToken,
        lastLogin: user?.lastLogin,
        updatedAt: new Date(),
      }
    });
  }
}
