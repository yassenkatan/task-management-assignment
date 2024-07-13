import { Controller, Get, Body, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { User } from '../../common/decorators/user.decorator';
import { UserRole } from '../enums/user-role.enum';
import { UserService } from '../services/user.service';
import { UserResponseForClientDto } from '../dto/user-response.dto';
import { UserModel } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Auth(UserRole.User)
@ApiTags('User')
@Controller('client/user')
export class ClientUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get My Profile',
    description: 'Get My Profile',
  })
  @ApiOkResponse({
    description: 'Get My Profile Success',
    type: UserResponseForClientDto,
  })
  @Get('get-my-profile')
  async getMyProfile(@User('id') id: string): Promise<UserResponseForClientDto> {
    const user: UserModel = await this.userService.checkIfUserFindByIdAndGetIt(
      id,
    );
    return await this.userService.makeUserResponseForClient(user);
  }

  @ApiOperation({
    summary: 'Update My Profile',
    description: 'Update My Profile',
  })
  @ApiOkResponse({
    description: 'Update My Profile Success',
    type: UserResponseForClientDto,
  })
  @Put('update-my-profile')
  async updateMyProfile(
    @User('id') id: string,
    @Body() updateMyProfile: UpdateUserDto,
  ): Promise<UserResponseForClientDto> {
    const user = await this.userService.updateMyProfile(id, updateMyProfile);
    return await this.userService.makeUserResponseForClient(user);
  }
}
