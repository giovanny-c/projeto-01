import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUser1650573456216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "users",
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
                            name: "password_hash",
                            type: "varchar",
                            isNullable: false
                        },
                        {
                            name: "salt",
                            type: "varchar",
                            isNullable: false
                        },
                        {
                            name:"is_confirmed",
                            type: "boolean",
                            default: false
                        }

                    ]
                }
            )
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }

}
