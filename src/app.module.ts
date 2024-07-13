import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/modules/admin-user.module';
import { AdminTaskModule } from './task/modules/admin-task.module';
import { AdminAuthModule } from './auth/modules/admin-auth.module';
import { SeederModule } from './common/seeder/seeder.module';
import { EnvironmentConfigModule } from './common/config/environment-config/environment-config.module';
import { ServerConstantModule } from './common/config/server-constant/server-constant.module';
import { EventModule } from './common/event/event.module';
import { MailModule } from './common/services/mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BcryptModule } from './common/services/bcrypt/bcrypt.module';
import { LocalStrategy } from './common/strategies/local.strategy';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './common/strategies/jwtRefresh.strategy';
import { ClientAuthModule } from './auth/modules/client-auth.module';
import { ClientUserModule } from './user/modules/client-user.module';
import { ClientTaskModule } from './task/modules/client-task.module';
import { join } from 'path';
import { EmailModule } from './email/email.module';
import { WinsotnModule } from './common/logger/logger.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      exclude: ['api*'],
      serveRoot: '/public',
      serveStaticOptions: {
        index: false,
      },
    }),
    {
      module: EnvironmentConfigModule,
      global: true,
    },
    {
      module: ServerConstantModule,
      global: true,
    },
    {
      module: EventModule,
      global: true,
    },
    {
      module: MailModule,
      global: true,
    },
    { module: SeederModule, global: true },
    {
      module: BcryptModule,
      global: true,
    },
    {
      module: EmailModule,
      global: true,
    },
    {
      module: WinsotnModule,
      global: true,
    },
    AdminUserModule,
    ClientUserModule,
    ClientAuthModule,
    AdminAuthModule,
    AdminTaskModule,
    ClientTaskModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy, WinsotnModule],
  exports: [WinsotnModule]
})
export class AppModule {}
