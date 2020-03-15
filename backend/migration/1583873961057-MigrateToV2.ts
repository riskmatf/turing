import {MigrationInterface, QueryRunner} from "typeorm";


//creating INSERT query to populate computers table so that we can add foreign keys
let arr : Array<[string, number]> = [
	[ '704',  16 ] , [ '718',  21 ] , [ 'bim', 21 ] , [ 'dlab', 11 ] , [ 'jag1', 21 ] ,
	[ 'jag2', 21 ] , [ 'rlab', 15 ]
];
let sqlValuesPerClassroom = arr.map(([name, numOfComps])=>{
	let oneClassroom : string[] = [];
	
	for(let i = 0; i < numOfComps; ++i){
		oneClassroom.push(`(${i}, "${name}")`);
	}
	return oneClassroom;
});

let sqlAllValues = sqlValuesPerClassroom.reduce((acc, val) => acc.concat(val), []).join(", ");
let sqlInsert = `INSERT INTO computers (id, classroomName) VALUES ${sqlAllValues};`;


export class MigrateToV21583873961057 implements MigrationInterface {
    name = 'MigrateToV21583873961057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `reports_ibfk_1`", undefined);
		await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `reports_ibfk_2`", undefined);
		
        await queryRunner.query("DROP TRIGGER IF EXISTS turing.reportsBU", undefined);
        await queryRunner.query("DROP TRIGGER IF EXISTS turing.reportsBI", undefined);

        await queryRunner.query("CREATE TABLE `computers` (`id` int NOT NULL, `classroomName` varchar(255) NOT NULL, `broken` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`, `classroomName`)) ENGINE=InnoDB", undefined);
		await queryRunner.query("ALTER TABLE `classrooms` DROP COLUMN `numberOfComputers`", undefined);
		
		await queryRunner.query(sqlInsert, undefined); //populating computers table

		await queryRunner.query("ALTER TABLE `reports` CHANGE `reportType` `isGeneral` tinyint(1)", undefined);

		//fixing isGeneral column
        await queryRunner.query("UPDATE reports SET isGeneral=1 WHERE computerId IS NULL", undefined);
		await queryRunner.query("UPDATE reports SET isGeneral=0 WHERE computerId IS NOT NULL", undefined);

        await queryRunner.query("ALTER TABLE `reports` CHANGE `computerID` `computerId` int NULL ", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `reportComment` `description` varchar(1000) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_unicode_ci\" NULL", undefined);
        await queryRunner.query("ALTER TABLE `classrooms` CHANGE `location` `location` varchar(20) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_unicode_ci\" NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `reports` CHANGE `classroomName` `classroomName` varchar(20) NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_255475c4fda29aba18cda3534a` ON `admins` (`displayName`)", undefined);
        await queryRunner.query("ALTER TABLE `computers` ADD CONSTRAINT `FK_f34fd0b795007e4ecd8e4942c02` FOREIGN KEY (`classroomName`) REFERENCES `classrooms`(`name`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_b40b9c11f873e54056edbbf7d66` FOREIGN KEY (`computerId`) REFERENCES `computers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_ad38a0e8694c1bbfcf12f36c34a` FOREIGN KEY (`classroomName`) REFERENCES `classrooms`(`name`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_0d8cae6b553f4b758c8d68bcc10` FOREIGN KEY (`adminUsername`) REFERENCES `admins`(`username`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
    }

	//no going back, run sql script for original version of db
    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_0d8cae6b553f4b758c8d68bcc10`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_ad38a0e8694c1bbfcf12f36c34a`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_b40b9c11f873e54056edbbf7d66`", undefined);
        // await queryRunner.query("ALTER TABLE `computers` DROP FOREIGN KEY `FK_f34fd0b795007e4ecd8e4942c02`", undefined);
        // await queryRunner.query("DROP INDEX `IDX_255475c4fda29aba18cda3534a` ON `admins`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` CHANGE `classroomName` `classroomName` varchar(20) NOT NULL", undefined);
        // await queryRunner.query("ALTER TABLE `classrooms` DROP COLUMN `location`", undefined);
        // await queryRunner.query("ALTER TABLE `classrooms` ADD `location` varchar(100) NOT NULL", undefined);
        // await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `computerId`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `description`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `isGeneral`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` ADD `reportComment` varchar(1000) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_unicode_ci\" NULL", undefined);
        // await queryRunner.query("ALTER TABLE `reports` ADD `computerID` int NULL", undefined);
        // await queryRunner.query("ALTER TABLE `reports` ADD `reportType` tinyint(1) NOT NULL", undefined);
        // await queryRunner.query("ALTER TABLE `classrooms` ADD `numberOfComputers` int NOT NULL", undefined);
        // await queryRunner.query("DROP TABLE `computers`", undefined);
        // await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`adminUsername`) REFERENCES `admins`(`username`) ON DELETE RESTRICT ON UPDATE RESTRICT", undefined);
        // await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`classroomName`) REFERENCES `classrooms`(`name`) ON DELETE CASCADE ON UPDATE RESTRICT", undefined);
    }

}
