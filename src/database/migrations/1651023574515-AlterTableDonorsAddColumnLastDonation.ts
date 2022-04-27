import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonorsAddColumnLastDonation1651023574515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("donors", new TableColumn({
            name: "last_donation",
            type: "timestamp",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("donors", "last_donation")
    }

}
