import {
  UserResponseForAdminModel,
  UserResponseForClientModel,
} from '../models/user-response.model';
import { UpdateUserModel } from '../models/update-user.model';
import { PageOptionsModel } from '../../common/pagination/models/page-options.model';
import { BadRequestException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../entities/user.entity';
import { PageMetaModel } from '../../common/pagination/models/page-meta.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enums/user-role.enum';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';
import { UserResponseForAdminDto } from '../dto/user-response.dto';
import { AllExceptionsFilter } from '../../common/exceptions/exceptions.filter';

@UseFilters(AllExceptionsFilter)
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcrypt: BcryptService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseForAdminDto> {
    const salt: string = await this.bcrypt.genSalt();
    const hashedPassword: string = await this.bcrypt.hash(createUserDto?.password, salt);
    const exist: UserModel = await this.userRepository.getByEmail(createUserDto?.email);
    if(exist != null) {
      throw new BadRequestException("User exist by email");
    } else {
      const user: UserModel = await this.userRepository.create({
        email: createUserDto?.email,
        firstName: createUserDto?.firstName,
        lastName: createUserDto?.lastName,
        password: hashedPassword,
        userRole: UserRole.User,
      });

      return await this.makeUserResponseForAdmin(user);
    }
  }

  async getUsersList(pageOptionsDto?: PageOptionsModel): Promise<{
    response: UserModel[];
    meta: PageMetaModel;
  }> {
    return await this.userRepository.getAll(pageOptionsDto);
  }

  async checkIfUserFindByEmailAndGetIt(email: string): Promise<UserModel> {
    const user: UserModel = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async checkIfUserFindByIdAndGetIt(id: string): Promise<UserModel> {
    const user: UserModel = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateMyProfile(id: string, updateUserModel: UpdateUserModel): Promise<UserModel> {
    const user: UserModel = await this.checkIfUserFindByIdAndGetIt(id);
    user.email = updateUserModel?.email.toLowerCase();
    user.firstName = updateUserModel?.firstName;
    user.lastName = updateUserModel?.lastName;
    return await this.userRepository.update(user);
  }

  async makeUserResponseForClient(
    userModel: UserModel,
  ): Promise<UserResponseForClientModel> {
    return new UserResponseForClientModel(userModel);
  }

  async makeUserResponseForAdmin(
    userModel: UserModel,
  ): Promise<UserResponseForAdminModel> {
    return new UserResponseForAdminModel(userModel);
  }

  async makeAllUsersResponseForAdmin(usersModel: UserModel[]): Promise<UserResponseForAdminModel[]> {
    const usersResponse: UserResponseForAdminModel[] = [];
    for (let i = 0; i < usersModel?.length; i++) {
      const user: UserModel = usersModel[i];
      const U: UserResponseForAdminModel = await this.makeUserResponseForAdmin(user);
      usersResponse.push(U);
    }
    return usersResponse;
  }
}
