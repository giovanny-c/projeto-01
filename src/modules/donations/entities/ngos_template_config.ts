
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { v4 as uuidV4 } from "uuid"

import { Ngo } from "./ngos";

@Entity("ngos_template_config")
class NgosTemplateConfig {
 
    @PrimaryColumn()
    id?: string

    @Column()
    ngo_id: string
 
    @OneToOne(() => Ngo)
    @JoinColumn({ name: "ngo_id" })
    ngo: Ngo

    @Column()
    configuration: string


    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }


}
export {NgosTemplateConfig}