import { MigrationInterface, QueryRunner } from "typeorm";

export class addPinReply1679820207637 implements MigrationInterface {
    name = 'addPinReply1679820207637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pin_reply\` (\`idx\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userIdx\` int NULL, \`replyIdx\` int NULL, PRIMARY KEY (\`idx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pin_reply\` ADD CONSTRAINT \`FK_2748243c755d284db15f817f055\` FOREIGN KEY (\`userIdx\`) REFERENCES \`user\`(\`idx\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pin_reply\` ADD CONSTRAINT \`FK_59827e1381c061c61a1934b3d58\` FOREIGN KEY (\`replyIdx\`) REFERENCES \`reply\`(\`idx\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pin_reply\` DROP FOREIGN KEY \`FK_59827e1381c061c61a1934b3d58\``);
        await queryRunner.query(`ALTER TABLE \`pin_reply\` DROP FOREIGN KEY \`FK_2748243c755d284db15f817f055\``);
        await queryRunner.query(`DROP TABLE \`pin_reply\``);
    }

}
