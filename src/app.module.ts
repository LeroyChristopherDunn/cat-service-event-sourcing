import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DbService } from './db.service';
import { MICRO_ORM_TEST_CONFIG, MIKRO_ORM_CONFIG } from './mikro-orm.config';
import { ENVIRONMENT } from './config';
import { CatModule } from './modules/cat/cat.module';

const mikroOrmLogger = new Logger(`MikroORM`);

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...(ENVIRONMENT === 'test' ? MICRO_ORM_TEST_CONFIG : MIKRO_ORM_CONFIG),
      logger: (message: string) => mikroOrmLogger.verbose(message),
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [DbService],
})
export class AppModule {}
