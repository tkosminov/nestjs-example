import { MigrationInterface, QueryRunner } from 'typeorm';

import { Client } from '../../oauth/client/client.entity';

export class seed1555415261703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Client)
      .values([
        {
          id: '5da33611-ec8b-4c63-b503-7dc76504a748',
          title: 'Client 1',
          secret: 'ce123d02a34a7802f68bc08d48c3a4a3',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .delete()
      .from(Client)
      .execute();
  }
}
