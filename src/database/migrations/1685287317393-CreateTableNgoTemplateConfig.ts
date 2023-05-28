import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableNgoTemplateConfig1685287317393 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "ngos_template_config",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "ngo_id",
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "configuration",
                    type: "varchar",
                    isPrimary: true
                },
            ],

            foreignKeys: [
                {
                    name: "FKNgosTemplateConfigs",
                    referencedTableName: "ngos",
                    referencedColumnNames: ["id"],
                    columnNames: ["ngo_id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE"
                }
            ]
        }) )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable("ngos_template_config")
    }

}
