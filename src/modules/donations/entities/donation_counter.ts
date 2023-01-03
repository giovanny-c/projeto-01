import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Ngo } from "./ngos";


import { v4 as uuidV4 } from "uuid"

@Entity("donation_counter")
class DonationCounter {

    @PrimaryColumn()
    id?: string

    @Column()
    ngo_id: string

    @OneToOne( ()=> Ngo)
    @JoinColumn({name: "ngo_id"})
    ngo: Ngo

    @Column()
    donation_number: number

    @Column()
    last_donation_number: number

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }

    

}

export {DonationCounter}