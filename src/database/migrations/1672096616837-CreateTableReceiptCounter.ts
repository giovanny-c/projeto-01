import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableReceiptCounter1672096616837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table ({
            name: "donation_counter",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "ngo_id",
                    type: "uuid",
                    isUnique: true
                    
                },
                {
                    name: "donotion_number",
                    type: "numeric",
                    isNullable: false
                },
                {
                    name: "last_donotion_number",
                    type: "numeric",
                    
                }
            ],
            foreignKeys :[
                {
                    name: "NGOsDonationCounter",
                    referencedTableName: "ngos",
                    referencedColumnNames: ["id"],
                    columnNames: ["ngo_id"]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("receipt_counter")
    }

}