import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class CorrecaoDeBurrice1672691969474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.changeColumns("donation_counter", [{

                    oldColumn: new TableColumn({
                        name: "donotion_number",
                        type: "numeric",
                        default: 1,
                        isNullable: false
                    }),
                    newColumn: new TableColumn
                    ({
                        name: "donation_number",
                        type: "numeric",
                        default: 1,
                        isNullable: false
                    })
                },

                {
                    oldColumn: new TableColumn({
                        name: "last_donotion_number",
                        type: "numeric",
                        default: 0,
                        isNullable: false
                    }),
                    newColumn: new TableColumn
                    ({
                        name: "last_donation_number",
                        type: "numeric",
                        default: 0,
                        isNullable: false
                    })  
                }
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumns("donation_counter", [{

            oldColumn: new TableColumn({
                name: "donation_number",
                type: "numeric",
                default: 1,
                isNullable: false
            }),
            newColumn: new TableColumn
            ({
                name: "donotion_number",
                type: "numeric",
                default: 1,
                isNullable: false
            })
        },

        {
            oldColumn: new TableColumn({
                name: "last_donation_number",
                type: "numeric",
                default: 0,
                isNullable: false
            }),
            newColumn: new TableColumn
            ({
                name: "last_donotion_number",
                type: "numeric",
                default: 0,
                isNullable: false
            })  
        }
    ]
)
    }

}
