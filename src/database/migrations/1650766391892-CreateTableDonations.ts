import { Generated, MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableDonations1650766391892 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "donations",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "ngo_id", //ong
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "donation_number",
                        type: "numeric",
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "worker_id",
                        type: "uuid",
                        isNullable: false
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
                        isNullable: false

                    },
                    {
                        name: "donation_value",
                        type: "numeric",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
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
                        onUpdate: "SET NULL" //Só vai ser null a foreign key?

                    },
                    {
                        name: "FKUserDonations",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Só vai ser null a foreign key?

                    },
                    {
                        name: "FKworkerDonations",
                        referencedTableName: "workers",
                        referencedColumnNames: ["id"],
                        columnNames: ["worker_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Só vai ser null a foreign key?

                    },
                    {
                        name: "FKngoDonations",
                        referencedTableName: "ngos",
                        referencedColumnNames: ["id"],
                        columnNames: ["ngo_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL" //Só vai ser null a foreign key?

                    }
                ]
                
            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("donations")
    }


}
