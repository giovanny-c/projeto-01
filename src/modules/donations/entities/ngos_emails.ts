import { Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import {v4 as uuidV4} from "uuid"
import { Ngo } from "./ngos"


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
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }



}

export {NgoEmail}