

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { User } from "../../user/entities/user";
import { Worker } from "../../workers/entities/worker";

@Entity("donors")
class Donor {

    @PrimaryColumn()
    id?: string

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    phone: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    last_donation: Date

    @Column()
    user_id: string

    @Column()
    worker_id: string

    @Column()
    send_by_message: boolean

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @ManyToOne(() => Worker)
    @JoinColumn({name: "worker_id"})
    worker: Worker

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }

    }



}


export { Donor }