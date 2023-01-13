import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTAbleNgos1673642678758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("ngos",new TableColumn({
            name: "alias",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("ngos", "alias")
    }

}
