import {MigrationInterface, QueryRunner} from "typeorm";

export class Cascade1588673785253 implements MigrationInterface {
    name = 'Cascade1588673785253';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_0d8cae6b553f4b758c8d68bcc10`", undefined);
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_b40b9c11f873e54056edbbf7d66`", undefined);
        await queryRunner.query("DROP INDEX `reports_ibfk_2` ON `reports`", undefined);
        await queryRunner.query("DROP INDEX `displayName_2` ON `admins`", undefined);
        await queryRunner.query("DROP INDEX `username` ON `admins`", undefined);
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_ad38a0e8694c1bbfcf12f36c34a`", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `isGeneral` `isGeneral` tinyint(1) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `description` `description` varchar(1000) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_unicode_ci\" NULL", undefined);
        await queryRunner.query("DROP INDEX `classroomName` ON `reports`", undefined);
        await queryRunner.query("CREATE INDEX `adminUsername` ON `reports` (`adminUsername`)", undefined);
        await queryRunner.query("CREATE INDEX `classroomName` ON `reports` (`classroomName`)", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_a0fd1d5ec174481c9da60962f18` FOREIGN KEY (`computerId`, `classroomName`) REFERENCES `computers`(`id`,`classroomName`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_ad38a0e8694c1bbfcf12f36c34a` FOREIGN KEY (`classroomName`) REFERENCES `classrooms`(`name`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_0d8cae6b553f4b758c8d68bcc10` FOREIGN KEY (`adminUsername`) REFERENCES `admins`(`username`) ON DELETE SET NULL ON UPDATE CASCADE", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_0d8cae6b553f4b758c8d68bcc10`", undefined);
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_ad38a0e8694c1bbfcf12f36c34a`", undefined);
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_a0fd1d5ec174481c9da60962f18`", undefined);
        await queryRunner.query("DROP INDEX `classroomName` ON `reports`", undefined);
        await queryRunner.query("DROP INDEX `adminUsername` ON `reports`", undefined);
        await queryRunner.query("CREATE INDEX `classroomName` ON `reports` (`classroomName`)", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `description` `description` varchar(1000) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_unicode_ci\" NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `isGeneral` `isGeneral` tinyint(1) NULL", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_ad38a0e8694c1bbfcf12f36c34a` FOREIGN KEY (`classroomName`) REFERENCES `classrooms`(`name`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `username` ON `admins` (`username`)", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `displayName_2` ON `admins` (`displayName`)", undefined);
        await queryRunner.query("CREATE INDEX `reports_ibfk_2` ON `reports` (`adminUsername`)", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_b40b9c11f873e54056edbbf7d66` FOREIGN KEY (`computerId`) REFERENCES `computers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_0d8cae6b553f4b758c8d68bcc10` FOREIGN KEY (`adminUsername`) REFERENCES `admins`(`username`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
    }

}
