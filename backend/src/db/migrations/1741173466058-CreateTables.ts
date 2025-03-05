import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1741173466058 implements MigrationInterface {
    name = 'CreateTables1741173466058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chat_type_enum" AS ENUM('group', 'dm')`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL, "type" "public"."chat_type_enum" NOT NULL DEFAULT 'dm', "avatarURL" character varying(255), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL, "chatId" uuid NOT NULL, "senderId" uuid NOT NULL, "text" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "username" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "avatarURL" character varying(255), "bio" text, "dateOfBirth" date NOT NULL, "createdAt" date NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users_user" ("chatId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_c6af481280fb886733ddbd73661" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a573fa22dfa3574496311588c" ON "chat_users_user" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2004be39e2b3044c392bfe3e61" ON "chat_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_6a573fa22dfa3574496311588c7" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" ADD CONSTRAINT "FK_2004be39e2b3044c392bfe3e617" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_2004be39e2b3044c392bfe3e617"`);
        await queryRunner.query(`ALTER TABLE "chat_users_user" DROP CONSTRAINT "FK_6a573fa22dfa3574496311588c7"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2004be39e2b3044c392bfe3e61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a573fa22dfa3574496311588c"`);
        await queryRunner.query(`DROP TABLE "chat_users_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TYPE "public"."chat_type_enum"`);
    }

}
