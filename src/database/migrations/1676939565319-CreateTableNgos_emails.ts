import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableNgosEmails1676939565319 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "ngos_emails",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "ngo_id",
                    type: "uuid",
                    isNullable: true
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "service",
                    type: "varchar",
                    isNullable: true
                },

            ],
            foreignKeys: [
                {
                    name: "FKNgosEmails",
                    referencedTableName: "ngos",
                    referencedColumnNames: ["id"],
                    columnNames: ["ngo_id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.dropForeignKey("ngos_emails", "FKNgosEmails")
        await queryRunner.dropTable("ngos_emails")
    }

}
