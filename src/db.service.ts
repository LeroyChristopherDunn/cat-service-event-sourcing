import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EntityManager, MikroORM } from '@mikro-orm/core';

// https://mikro-orm.io/docs/schema-generator#using-schemagenerator-programmatically

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async onModuleInit() {
    if (this.orm.config.get('dbName') === ':memory:')
      await this.autoInitializeDatabase(this.orm);
  }

  private async autoInitializeDatabase(orm: MikroORM) {
    this.logger.log(`Database Auto initialization starting`);

    const generator = orm.getSchemaGenerator();

    // const dropDump = await generator.getDropSchemaSQL();
    // this.logger.debug('dropDump', dropDump);

    // const createDump = await generator.getCreateSchemaSQL();
    // this.logger.debug('createDump', createDump);

    // const updateDump = await generator.getUpdateSchemaSQL();
    // this.logger.debug('updateDump', updateDump);

    // in tests it can be handy to use those:
    await generator.refreshDatabase(); // ensure db exists and is fresh

    this.logger.log(`Database Auto initialization finished`);
  }
}
