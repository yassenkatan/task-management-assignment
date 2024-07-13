import { Controller, Get, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../user/enums/user-role.enum';
import { User } from '../../common/decorators/user.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { IsAuthenticatedDto } from '../dto/isAuthenticated.dto';
import { LoginResponseDto } from '../dto/login-user-response.dto';
import { LoginUserDto } from '../dto/login.dto.ts';
import { UserModel } from 'src/user/entities/user.entity';
import { RefreshResponseDto } from '../dto/refresh-response-dto';

@ApiTags('Auth')
@Controller('client/auth')
export class ClientAuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Auth(UserRole.User)
  @Get('is_authenticated')
  @ApiOperation({ description: 'Is authenticated' })
  @ApiOkResponse({ type: IsAuthenticatedDto })
  async isAuthenticated(@User('email') email: string) {
    const user = await this.authService.checkIfAuthenticated(email);
    return this.authService.makeIsAuthenticatedResponse(user);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiOperation({ description: 'Local Login' })
  async login(@Body() auth: LoginUserDto) {
    const user: UserModel = await this.authService.validateUserForLocalStrategy(
      auth?.userName,
      auth?.password,
    );

    if (
      user?.userRole !== UserRole?.Admin &&
      user?.userRole !== UserRole?.User
    ) {
      throw new UnauthorizedException("Unauthorized");
    }

      const accessTokenCookie = await this.authService.getJwtToken(
        auth?.userName,
      );
      const refreshTokenCookie = await this.authService.getJwtRefreshToken(
        auth?.userName,
      );
      return {
        ...accessTokenCookie,
        ...refreshTokenCookie,
      };
  }

  @Post('logout')
  @Auth()
  @ApiOperation({ description: 'Log out' })
  async logout(@User('email') email: string): Promise<string> {
    await this.authService.logoutUser(email);
    return 'Logout successful';
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiHeader({ name: 'refresh-token', required: false })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiOperation({ description: 'Refresh token' })
  async refresh(@User('email') email: string) {
    const accessToken = await this.authService.getJwtToken(email);
    const refreshToken = await this.authService.getJwtRefreshToken(email);
    return {
      ...accessToken,
      ...refreshToken,
    };
  }
}
