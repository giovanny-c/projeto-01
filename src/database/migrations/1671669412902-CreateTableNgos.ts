import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableNgos1671669412902 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "ngos",
            columns: [
                {
                    name:"id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name:"name",
                    type: "varchar",
                },
                {
                    name: "full_name",
                    type: "varchar",
                }
            ]

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ngos")
    }

}
