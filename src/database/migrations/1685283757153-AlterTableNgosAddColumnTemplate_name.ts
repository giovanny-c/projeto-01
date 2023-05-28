import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableNgosAddColumnTemplateName1685283757153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("ngos", new TableColumn({
            name: "template_name",
            type: "varchar",
            isNullable: true   
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("ngos", "template_name")
    }

}
