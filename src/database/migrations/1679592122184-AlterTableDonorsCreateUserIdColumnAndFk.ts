import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AlterTableDonorsCreateUserIdColumnAndFk1679592122184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("donors", new TableColumn({
        
            name: "user_id",
            type: "uuid",
            isNullable: true
            
        }))

        await queryRunner.createForeignKey("donors", new TableForeignKey({
            name: "FKDonorsUsers",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey("donors", "FKDonorsUsers" )
        await queryRunner.dropColumn("donors", "user_id")
    }

}
