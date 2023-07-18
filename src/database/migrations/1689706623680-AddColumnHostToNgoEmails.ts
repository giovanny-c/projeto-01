import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddColumnHostToNgoEmails1689706623680 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("ngos_emails", new TableColumn({
            name: "host",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("ngos_emails", "host")
    }

}
