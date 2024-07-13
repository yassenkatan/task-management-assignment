import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EnvironmentConfigService } from '../../common/config/environment-config/environment-config.service';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';
import { IJwtServicePayload } from '../../common/services/jwt/jwt.interface';
import { JwtTokenService } from '../../common/services/jwt/jwt.service';
import { IsAuthenticatedResponseModel } from '../models/isAuthenticated-response.model';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { UserModel } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtConfig: EnvironmentConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async getUserByUserName(userName: string): Promise<UserModel> {
    const userByEmail: UserModel = await this.userRepository.getByEmail(
      userName,
    );
    if (userByEmail) {
      return userByEmail;
    }
  }

  async validateUserForLocalStrategy(
    userName: string,
    password: string,
  ): Promise<UserModel> {
    const user: UserModel = await this.getUserByUserName(userName);
    if (!user) {
      return null;
    }
    const match: boolean = await this.bcryptService.compare(password, user?.password);
    if (!match) {
      throw new BadRequestException("Username or Password incorrect");
    }
    if (user && match) {
      await this.updateLoginTime(user?.email);
      return user;
    }
    return null;
  }

  async validateUserForJWTStrategy(email: string) {
    const user: UserModel = await this.userRepository.getByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async getJwtToken(
    userName: string,
  ): Promise<{ accessToken: string; accessTokenExpirationDate: Date }> {
    let payload: IJwtServicePayload;
    const userByEmail: UserModel = await this.userRepository.getByEmail(userName);
    if (userByEmail) {
      payload = { email: userByEmail?.email };
    }
    const secret: string = this.jwtConfig.getJwtSecret();
    const expirationTime: number = Number(this.jwtConfig.getJwtExpirationTime());
    const expiresIn: string = expirationTime + 's';
    const token: string = this.jwtTokenService.createToken(payload, secret, expiresIn);
    const currentTime: Date = new Date();
    const accessTokenExpirationDate: Date = new Date(
      currentTime.setSeconds(currentTime.getSeconds() + expirationTime),
    );
    return {
      accessToken: token,
      accessTokenExpirationDate: accessTokenExpirationDate,
    };
  }

  async getJwtRefreshToken(
    userName: string,
  ): Promise<{ refreshToken: string; refreshTokenExpirationDate: Date }> {
    let payload: IJwtServicePayload;
    const userByEmail: UserModel = await this.userRepository.getByEmail(userName);
    if (userByEmail) {
      payload = { email: userByEmail?.email };
    }
    const secret: string = this.jwtConfig.getJwtRefreshSecret();
    const expirationTime: number = Number(this.jwtConfig.getJwtRefreshExpirationTime());
    const expiresIn: string = expirationTime + 's';

    const token: string = this.jwtTokenService.createToken(payload, secret, expiresIn);

    const currentTime: Date = new Date();
    const refreshTokenExpirationDate: Date = new Date(
      currentTime.setSeconds(currentTime.getSeconds() + expirationTime),
    );

    await this.setCurrentRefreshToken(token, payload?.email);
    return {
      refreshToken: token,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
    };
  }

  async getUserFromAuthToken(token: string): Promise<UserModel> {
    try {
      const payload = await this.jwtTokenService.checkToken(token, {
        secret: this.jwtConfig.getJwtSecret(),
      });

      const email: string = payload?.email;

      if (email) {
        return this.userRepository.getByEmail(email);
      } else {
        return null;
      }
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async checkIfAuthenticated(email: string): Promise<UserModel> {
    return this.userRepository.getByEmail(email);
  }

  async makeIsAuthenticatedResponse(
    user: UserModel,
  ): Promise<IsAuthenticatedResponseModel> {
    return new IsAuthenticatedResponseModel(user);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    email: string,
  ): Promise<void> {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
      user.hashRefreshToken = currentHashedRefreshToken;
    await this.userRepository.update(
      user
    );
  }

  async updateLoginTime(email: string): Promise<void> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
      user.lastLogin = new Date();
    await this.userRepository.update(user);
  }

  async logoutUser(email: string): Promise<void> {
    const user: UserModel =
      await this.userService.checkIfUserFindByEmailAndGetIt(email);
      user.hashRefreshToken = null;
    await this.userRepository.update(user);
  }
}
