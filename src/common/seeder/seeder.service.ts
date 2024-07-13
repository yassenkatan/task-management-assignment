import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserRole } from '../../user/enums/user-role.enum';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: EnvironmentConfigService,
    private readonly bcrypt: BcryptService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const password = this.config.getAdminPassword();
    const salt = await this.bcrypt.genSalt();
    const hashedPassword = await this.bcrypt.hash(password, salt);
    const adminEmail = this.config.getAdminEmail()?.toLowerCase();
    let exist = await this.userRepository.getByEmail(adminEmail);
    if(exist == null) {
      await this.userRepository.create({
        email: adminEmail,
        firstName: 'Super',
        lastName: 'Admin',
        password: hashedPassword,
        userRole: UserRole.Admin,
      });
    }  
  }
}
