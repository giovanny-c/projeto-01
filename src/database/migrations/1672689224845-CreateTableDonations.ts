import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableDonations1672689224845 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.createTable(
            new Table ({
                name: "donations",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "donation_number",
                        type: "numeric",
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "worker_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "donor_id",
                        type: "uuid",
                        isNullable: true

                    },
                    {
                        name: "donor_name",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "ngo_id",
                        type: "uuid",
                        isNullable: true

                    },
                    {
                        name: "donation_value",
                        type: "numeric",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        isNullable: false
                    },
                    {
                        name: "payed_at",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "is_payed",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "is_donation_canceled",
                        type: "boolean",
                        isNullable: true
                    },


                ],

                foreignKeys: [
                    {
                        name: "FKDonorsDonations",
                        referencedTableName: "donors",
                        referencedColumnNames: ["id"],
                        columnNames: ["donor_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Trocar por CASCADE, só afeta se o id da tabela for alterado

                    },
                    {
                        name: "FKUserDonations",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Trocar por CASCADE, só afeta se o id da tabela for alterado

                    },
                    {
                        name: "FKworkerDonations",
                        referencedTableName: "workers",
                        referencedColumnNames: ["id"],
                        columnNames: ["worker_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Trocar por CASCADE, só afeta se o id da tabela for alterado

                    },
                    {
                        name: "FKngoDonations",
                        referencedTableName: "ngos",
                        referencedColumnNames: ["id"],
                        columnNames: ["ngo_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Trocar por CASCADE, só afeta se o id da tabela for alterado

                    }
                ]
                
            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("donations")
    }
}
