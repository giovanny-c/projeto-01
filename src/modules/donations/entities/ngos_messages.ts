
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import {v4 as uuidV4} from "uuid"
import { Ngo } from "./ngos"

@Entity("ngos_messages")
class NgoMessage {

    @PrimaryColumn()
    id?: string

    @ManyToOne(() => Ngo)
    @JoinColumn({ name: "ngo_id" })
    ngo: Ngo

    @Column()
    ngo_id: string

    @Column()
    name: string

    @Column()
    message: string

    @Column()
    subject: string
 
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }



}

export {NgoMessage}