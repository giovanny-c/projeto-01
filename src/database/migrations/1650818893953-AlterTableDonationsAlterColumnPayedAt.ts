import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonationsAlterColumnPayedAt1650818893953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("donations", "payed_at", new TableColumn({
            name: "payed_at",
            type: "timestamp",
            isNullable: true

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("donations", "payed_at", new TableColumn({
            name: "payed_at",
            type: "timestamp",

        }))
    }

}
