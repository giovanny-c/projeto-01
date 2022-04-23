import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableDonorCreatingDateColumns1650744624919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("donors",
            new TableColumn(
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
            )

        )

        await queryRunner.addColumn("donors",
            new TableColumn(
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                },
            )

        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropColumns("donors", new TableColumn["updated_at, created_at"])
    }

}
