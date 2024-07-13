
import { UserModel } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseForAdminModel {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  userRole: UserRole;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(userModel: UserModel) {
    this.id = userModel?.id;
    this.fullName = `${userModel?.firstName} ${userModel?.lastName}`;
    this.firstName = userModel?.firstName;
    this.lastName = userModel?.lastName;
    this.email = userModel?.email;
    this.userRole = userModel?.userRole;
    this.lastLogin = userModel?.lastLogin;
    this.createdAt = userModel?.createdAt;
    this.updatedAt = userModel?.updatedAt;
  }
}

export class UserResponseForClientModel {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;

  constructor(userModel: UserModel) {
    this.id = userModel?.id;
    this.fullName = `${userModel?.firstName} ${userModel?.lastName}`;
    this.firstName = userModel?.firstName;
    this.lastName = userModel?.lastName;
    this.email = userModel?.email;
  }
}
