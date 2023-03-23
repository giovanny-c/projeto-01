

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { User } from "../../user/entities/user";

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

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }

    }



}


export { Donor }