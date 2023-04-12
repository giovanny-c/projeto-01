import { Exclude } from "class-transformer";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { Worker } from "../../workers/entities/worker";

@Entity("users")
class User {

    @PrimaryColumn()
    id?: string

    @Column()
    name: string

    @Exclude()
    @Column()
    password_hash: string

    @Exclude()
    @Column()
    salt: string

    @Column()
    admin: boolean

    @Column()
    email: string

    @Column()
    worker_id?: string

    @OneToOne( () => Worker )
    @JoinColumn({name: "worker_id"})
    worker: Worker

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { User }