import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"

@Entity("users")
class User {

    @PrimaryColumn()
    id?: string

    @Column()
    name: string

    @Column()
    password: string


    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { User }