import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonationsAddCancelDonationColumn1650904510809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("donations", new TableColumn({
            name: "is_donation_canceled",
            type: "boolean",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("donations", "is_donation_canceled")
    }

}
