import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

import { v4 as uuidV4 } from "uuid"
import { NgoEmail } from "./ngos_emails";
import { NgoMessage } from "./ngos_messages";

@Entity("ngos")
class Ngo {
 
    @PrimaryColumn()
    id?: string

    @Column()
    name: string

    @Column()
    alias: string

    @Column()
    full_name: string

    @OneToMany(() => NgoEmail, ngo_emails => ngo_emails.ngo, {cascade: true})
    ngo_emails: NgoEmail[]

    @OneToMany(() => NgoMessage, ngo_messages => ngo_messages.ngo, {cascade: true})
    ngo_messages: NgoMessage[]
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }


}
export {Ngo}