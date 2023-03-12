import { Exclude } from "class-transformer";
import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"

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
    is_confirmed: boolean


    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { User }