import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersAddAdmin1675796804592 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({
            name: "admin",
            type: "boolean",
            isNullable: false,
            default: false
        }),
        
        new TableColumn({
            name: "email",
            type: "varchar",
            isNullable: true
        })
    ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("users", ["admin", "email"])
    }

}
