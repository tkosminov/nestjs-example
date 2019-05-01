import { MigrationInterface, QueryRunner } from 'typeorm';

import { Permission } from '../../core/permission/permission.entity';

export class seed1555139717086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values([
        {
          id: 1,
          value: 'admin',
        },
        {
          id: 2,
          value: 'moder',
        },
        {
          id: 3,
          value: 'user',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection
      .createQueryBuilder()
      .delete()
      .from(Permission)
      .execute();
  }
}
