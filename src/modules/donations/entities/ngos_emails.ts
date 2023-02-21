import { Column, PrimaryColumn } from "typeorm"
import {v4 as uuidV4} from "uuid"


class NgoEmail {

    @PrimaryColumn()
    id?: string

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