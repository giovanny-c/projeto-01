import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnSendByMessage1729098741204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("donors", new TableColumn({
            name: "send_by_message",
            type: "boolean",
            isNullable: true,
            default: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("donors", "send_by_message")
    }

}
