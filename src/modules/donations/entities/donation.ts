import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Donor } from "../../donor/entities/donor";

import { v4 as uuidV4 } from "uuid"
import { User } from "../../user/entities/user";

@Entity("donations")
class Donation {

    @PrimaryColumn()
    id?: string

    @Column()
    @Generated("increment")
    donation_number: Number

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

    @Column()
    donation_value: Number

    @CreateDateColumn()
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