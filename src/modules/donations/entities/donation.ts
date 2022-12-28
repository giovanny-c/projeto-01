import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { v4 as uuidV4 } from "uuid"

import { Donor } from "../../donor/entities/donor";
import { User } from "../../user/entities/user";
import { Worker } from "../../workers/entities/worker";
import { Ngo } from "./ngos";

@Entity("donations")
class Donation {

    @PrimaryColumn()
    id?: string

    @Column()
    donation_number: number

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    user_id: string

    @ManyToOne(() => Donor)
    @JoinColumn({ name: "donor_id" })
    donor: Donor

    @Column()
    donor_id: string
    
    @ManyToOne(() => Worker)
    @JoinColumn({ name: "worker_id" })
    worker: Worker
    
    @Column()
    worker_id: string

    @ManyToOne(() => Ngo)
    @JoinColumn({ name: "ngo_id" })
    ngo: Ngo
    
    @Column() 
    ngo_id: string


    @Column()
    donation_value: Number

    @Column()
    created_at: Date

    @Column()
    payed_at: Date

    @Column()
    is_payed: boolean

    @Column()
    is_donation_canceled: boolean

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }

}

export { Donation }