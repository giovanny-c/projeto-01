import { Column, Entity, PrimaryColumn } from "typeorm";

import { v4 as uuidV4 } from "uuid"

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
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }


}
export {Ngo}