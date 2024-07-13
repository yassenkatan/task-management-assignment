import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './common/services/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import {
  ResponseFormat,
  ResponseInterceptor,
} from './common/interceptors/response.interceptor';
import { ServerConstantService } from './common/config/server-constant/server-constant.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentConfigService } from './common/config/environment-config/environment-config.service';
import { AdminUserModule } from './user/modules/admin-user.module';
import { AdminAuthModule } from './auth/modules/admin-auth.module';
import { ClientAuthModule } from './auth/modules/client-auth.module';
import { ClientUserModule } from './user/modules/client-user.module';
import { AdminTaskModule } from './task/modules/admin-task.module';
import { ClientTaskModule } from './task/modules/client-task.module';
import { AllExceptionsFilter } from './common/exceptions/exceptions.filter';
import { WinstonLogger } from './common/logger/logger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConstant = app.get<ServerConstantService>(ServerConstantService);
  const configService = app.get<EnvironmentConfigService>(
    EnvironmentConfigService,
  );
  const logger = app.get<WinstonLogger>(WinstonLogger);

  // Cors
  app.enableCors();

  // Helmet
  app.use(helmet());

  // DB
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Validations
  app.useGlobalPipes(new ValidationPipe());

  // base routing
  app.setGlobalPrefix(serverConstant.getGenericUrlPrefix());

  // swagger config
  const dashboardUrl = `/${serverConstant.getGenericUrlPrefix()}/dashboard/api-docs`;
  const clientUrl = `/${serverConstant.getGenericUrlPrefix()}/client/api-docs`;

  const dashboardConfig = new DocumentBuilder()

    .setTitle('Yassin Kattan Assignment - Dashboard Docs API')
    .setDescription('Documents for dashboard endpoints ...')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('Yassin Kattan Assignment')
    .build();

  const clientConfig = new DocumentBuilder()

    .setTitle('Yassin Kattan Assignment - Client Docs API')
    .setDescription('Documents for client endpoints ...')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('Yassin Kattan Assignment')
    .build();

  const dashboardDocument = SwaggerModule.createDocument(app, dashboardConfig, {
    include: [AdminUserModule, AdminTaskModule, AdminAuthModule],
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });

  const clientDocument = SwaggerModule.createDocument(app, clientConfig, {
    include: [
      ClientAuthModule,
      ClientUserModule,
      ClientTaskModule,
    ],
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(dashboardUrl, app, dashboardDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  SwaggerModule.setup(clientUrl, app, clientDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(configService.getServerPort(), () => {
    console.log(`\nServer Running on ${serverConstant.getBaseUrl()}\n
      API Documentation For Dashboard Running on ${serverConstant.getBaseUrl()}/${serverConstant.getGenericUrlPrefix()}/dashboard/api-docs\n
      API Documentation For Client Running on ${serverConstant.getBaseUrl()}/${serverConstant.getGenericUrlPrefix()}/client/api-docs`);
  });
}

bootstrap();
