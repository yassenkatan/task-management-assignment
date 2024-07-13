import { Body, Controller, Get, Post, Query, Search } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { PageOptionsDto } from '../../common/pagination/dto/pagination-options.dto';
import { PageDto } from '../../common/pagination/dto/pagination.dto';
import { UserRole } from '../enums/user-role.enum';
import { UserService } from '../services/user.service';
import { UserResponseForAdminDto } from '../dto/user-response.dto';
import { PageMetaDto } from '../../common/pagination/dto/pagination-meta.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Auth(UserRole.Admin)
@ApiTags('User')
@Controller('dashboard/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiOperation({
    summary: 'Create User',
    description: 'Create User',
  })
  async signupUserByEmail(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(
      createUserDto,
    );
  }
  
  @ApiOperation({
    summary: 'Get Users List',
    description: 'Get Users List',
  })
  @ApiOkResponse({
    description: 'Get Users List Success',
    type: [UserResponseForAdminDto],
  })
  @Get('users-list')
  async getUsersList(
    @Query()
    pageOptionsDto?: PageOptionsDto,
  ): Promise<{
    response: {
        users: UserResponseForAdminDto[];
    };
    meta: PageMetaDto;
}> {
    const users = await this.userService.getUsersList(pageOptionsDto);

    const response = await this.userService.makeAllUsersResponseForAdmin(
      users?.response,
    );
    const pagination = new PageDto(response, users?.meta);
    return {
      response: {
        users: pagination?.response,
      },
      meta: pagination?.meta,
    };
  }
}
