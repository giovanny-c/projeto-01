import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddColumnWorkerIdToDonors1681673861926 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("donors", new TableColumn({
            name: "worker_id",
            type: "uuid",
            isNullable: true
        }))

        await queryRunner.createForeignKey("donors", new TableForeignKey({
            name: "FKWorkersDonors",
                referencedTableName: "workers",
                referencedColumnNames: ["id"],
                columnNames: ["worker_id"],
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("donors", "FKWorkersDonors")
        await queryRunner.dropColumn("donors", "worker_id")
    }

}
