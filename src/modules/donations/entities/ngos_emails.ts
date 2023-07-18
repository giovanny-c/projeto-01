import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import {v4 as uuidV4} from "uuid"
import { Ngo } from "./ngos"

@Entity("ngos_emails")
class NgoEmail {

    @PrimaryColumn()
    id?: string

    @ManyToOne(() => Ngo)
    @JoinColumn({ name: "ngo_id" })
    ngo: Ngo

    @Column()
    ngo_id: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    service: string

    @Column()
    host: string
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }



}

export {NgoEmail}