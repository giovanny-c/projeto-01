import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AlterTableDonationsAddColumnWorkerIdAndFKDonationsWorkers1651331529224 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("donations", new TableColumn({
            name: "worker_id",
            type: "uuid",
            isNullable: true
        }))

        await queryRunner.createForeignKey(
            "donations",
            new TableForeignKey({
                name: "FKWorkersDonations",
                referencedTableName: "workers",
                referencedColumnNames: ["id"],
                columnNames: ["worker_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL"
            })


        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("donations", "worker_id")

        await queryRunner.dropForeignKey("donations", "FKWorkersDonations")

    }


}
