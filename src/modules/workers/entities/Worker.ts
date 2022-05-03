import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { Donation } from "../../donations/entities/donation";

@Entity("workers")
class Worker {
    @PrimaryColumn()
    id?: string

    @OneToMany(() => Donation, (donations) => donations.worker)
    donations: Donation[]

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Date

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { Worker }