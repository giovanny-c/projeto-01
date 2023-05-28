import { Exclude } from "class-transformer";
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

    @Column()
    template_name: string

    @Exclude()
    @OneToMany(() => NgoEmail, ngo_emails => ngo_emails.ngo, {cascade: true})
    ngo_emails: NgoEmail[]
    
    @Exclude()
    @OneToMany(() => NgoMessage, ngo_messages => ngo_messages.ngo, {cascade: true})
    ngo_messages: NgoMessage[]
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }


}
export {Ngo}