import { boolean } from "joi"
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersAddColumnMaster1681490062056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("users", new TableColumn({
            name: "master",
            type: "boolean",
            isNullable: true,
            isUnique: true,
            default: null

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.dropColumn("users", "master")
    }


}
