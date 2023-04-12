import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddUserIdToDonorsAndWorkerIdToUsersPlusFKs1681259797515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        // await queryRunner.addColumn("donors", new TableColumn({
        //     name: "user_id",
        //     type: "uuid",
        //     isNullable: true
        // }))

        await queryRunner.addColumn("users", new TableColumn({
            name: "worker_id",
            type: "uuid",
            isNullable: true
        }))

        await queryRunner.createForeignKey("donors",
            new TableForeignKey({
                name: "FKUserDonors",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_id"],
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            })
        )

        await queryRunner.createForeignKey("users",
            new TableForeignKey({
                name: "FKworkerUser",
                referencedTableName: "workers",
                referencedColumnNames: ["id"],
                columnNames: ["worker_id"],
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey("users" ,"FKworkerUser")
        await queryRunner.dropForeignKey("donors", "FKUserDonors")

        await queryRunner.dropColumn("users", "worker_id")
        // await queryRunner.dropColumn("donors", "user_id")
    }

}
