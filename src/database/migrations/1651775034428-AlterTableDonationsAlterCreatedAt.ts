import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonationsAlterCreatedAt1651775034428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.changeColumn("donations", "created_at", new TableColumn({
            name: "created_at",
            type: "timestamp",
            isNullable: false
        }))


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("donations", "created_at", new TableColumn({
            name: "created_at",
            type: "timestamp",
            default: "now()",

        }))
    }

}
