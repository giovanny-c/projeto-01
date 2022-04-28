import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createTableWorkers1651162482636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "workers",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isGenerated: true,
                    generationStrategy: "uuid"
                },
                {
                    name: "name",
                    type: "varchar",
                    //unique?
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
