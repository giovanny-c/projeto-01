import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class fixForeignKeys1675280962795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("donations", "FKDonorsDonations")
        await queryRunner.dropForeignKey("donations", "FKUserDonations")
        await queryRunner.dropForeignKey("donations", "FKworkerDonations")
        await queryRunner.dropForeignKey("donations", "FKngoDonations")

        await queryRunner.createForeignKeys("donations", [
            new TableForeignKey({
                    name: "FKDonorsDonations",
                    referencedTableName: "donors",
                    referencedColumnNames: ["id"],
                    columnNames: ["donor_id"],
                    onDelete: "SET NULL", //Ou restrict
                    onUpdate: "CASCADE" //Só vai ser null a foreign key?
                }
            ),
            new TableForeignKey({
                    name: "FKUserDonations",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames: ["user_id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE" 
                }
            ),
            new TableForeignKey({
                    name: "FKworkerDonations",
                    referencedTableName: "workers",
                    referencedColumnNames: ["id"],
                    columnNames: ["worker_id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE"
                }
            ),
            new TableForeignKey({
                    name: "FKngoDonations",
                    referencedTableName: "ngos",
                    referencedColumnNames: ["id"],
                    columnNames: ["ngo_id"],
                    onDelete: "SET NULL",
                    onUpdate: "CASCADE" 
                }
            )
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("donations", "FKDonorsDonations")
        await queryRunner.dropForeignKey("donations", "FKUserDonations")
        await queryRunner.dropForeignKey("donations", "FKworkerDonations")
        await queryRunner.dropForeignKey("donations", "FKngoDonations")

        await queryRunner.createForeignKeys("donations", [
            new TableForeignKey({
                    name: "FKDonorsDonations",
                    referencedTableName: "donors",
                    referencedColumnNames: ["id"],
                    columnNames: ["donor_id"],
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL" 
                }
            ),
            new TableForeignKey({
                name: "FKUserDonations",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL" 
                }
            ),
            new TableForeignKey({
                name: "FKworkerDonations",
                referencedTableName: "workers",
                referencedColumnNames: ["id"],
                columnNames: ["worker_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL"
                }
            ),
            new TableForeignKey({
                name: "FKngoDonations",
                referencedTableName: "ngos",
                referencedColumnNames: ["id"],
                columnNames: ["ngo_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL" 
                }
            )
        ])
    }

}
       
                   