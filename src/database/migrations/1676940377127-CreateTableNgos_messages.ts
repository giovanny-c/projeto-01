import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableNgosMessages1676940377127 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "ngos_messages",
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
                    name: "message",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "subject",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "start_date",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "end_date",
                    type: "timestamp",
                    isNullable: true
                },

            ],
            foreignKeys: [
                {
                    name: "FKNgosMessages",
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
        
        await queryRunner.dropForeignKey("ngos_messages", "FKNgosMessages")
        await queryRunner.dropTable("ngos_messages")
    }
}
