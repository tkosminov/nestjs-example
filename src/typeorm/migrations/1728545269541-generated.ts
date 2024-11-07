import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1728545269541 implements MigrationInterface {
  name = 'Generated1728545269541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recovery_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_1085f48c9ad9e0228b28e2bab03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_0d3d5de9983075345e704d7d06" ON "recovery_key" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_6bbe63d2fe75e7f0ba1710351d" ON "refresh_token" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "username" character varying NOT NULL, "encrypted_password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" (lower("username")) `);
    await queryRunner.query(
      `ALTER TABLE "recovery_key" ADD CONSTRAINT "FK_0d3d5de9983075345e704d7d067" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`);
    await queryRunner.query(`ALTER TABLE "recovery_key" DROP CONSTRAINT "FK_0d3d5de9983075345e704d7d067"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6bbe63d2fe75e7f0ba1710351d"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0d3d5de9983075345e704d7d06"`);
    await queryRunner.query(`DROP TABLE "recovery_key"`);
  }
}
