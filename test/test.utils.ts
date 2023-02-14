import { ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export async function setupTestApp() {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  // const logger = new Logger('Test');
  // testingModuleBuilder.setLogger(logger);

  const testingModule: TestingModule = await testingModuleBuilder.compile();

  const app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  return app;
}

@Injectable()
export class MockAuthGuard extends AuthGuard('mock') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    return true;
  }
}
