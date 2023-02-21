
import { Column, PrimaryColumn } from "typeorm"
import {v4 as uuidV4} from "uuid"


class NgoMessage {

    @PrimaryColumn()
    id?: string

    @Column()
    ngo_id: string

    @Column()
    message: string

    @Column()
    subject: string

    @Column()
    start_date: Date

    @Column()
    end_date: Date
    
    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }



}

export {NgoMessage}