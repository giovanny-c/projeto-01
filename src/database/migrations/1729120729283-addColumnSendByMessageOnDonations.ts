import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnSendByMessageOnDonations1729120729283 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("donations", new TableColumn({
            name: "sent_by_message",
            type: "boolean",
            isNullable: true,
            default: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("donations", "sent_by_message")
    }

}
