import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableDonors1650670753236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "donors",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "name",
                            type: "varchar",
                        },
                        {
                            name: "email",
                            type: "varchar"
                        },
                        {
                            name: "phone",
                            type: "varchar"
                        }
                    ]

                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("donors")
    }

}
