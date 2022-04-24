import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersAddPasswordColumn1650822489262 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropColumn("users", "password")
    }

}
