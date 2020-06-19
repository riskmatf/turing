import {MigrationInterface, QueryRunner} from "typeorm";

// tslint:disable-next-line:class-name
export class renameJagic1592161030947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("update classrooms set location=\"Jagić\" where location=\"Jagic\"", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("update classrooms set location=\"Jagic\" where location=\"Jagić\"", undefined);
    }

}
