import { UserModel } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enums/user-role.enum';

export class IsAuthenticatedResponseModel {
  userId: string;
  email: string;
  userRole: UserRole;

  constructor(user?: UserModel) {
    this.userId = user?.id;
    this.email = user?.email;
    this.userRole = user?.userRole;
  }
}
