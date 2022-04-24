import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonationsAlterColumnDonationNumberGenerationStrategy1650818051376 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("donations", "donation_number", new TableColumn({
            name: "donation_number",
            type: "numeric",
            isGenerated: true,
            generationStrategy: "increment"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("donations", "donation_number", new TableColumn({
            name: "donation_number",
            type: "numeric",

        }))
    }

}
