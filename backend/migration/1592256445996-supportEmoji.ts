import {MigrationInterface, QueryRunner} from "typeorm";

// tslint:disable-next-line:class-name
export class supportEmoji1592256445996 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("set names utf8mb4", undefined);
        await queryRunner.query("alter table reports character set = utf8mb4 collate = utf8mb4_general_ci", undefined);
        await queryRunner.query("alter database turing character set = utf8mb4 collate = utf8mb4_general_ci", undefined);
        await queryRunner.query("alter table reports modify description varchar(1000) character set utf8mb4 collate utf8mb4_bin", undefined);
        await queryRunner.query("alter table reports modify adminComment varchar(1000) character set utf8mb4 collate utf8mb4_bin", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // no going back
        return;
    }

}
