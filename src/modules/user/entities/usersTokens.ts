import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";
import { v4 as uuidV4 } from "uuid"

@Entity("users_tokens")
class UsersTokens {

    @PrimaryColumn()
    id: string

    @Column()
    refresh_token: string

    @Column()
    user_id: string

    @ManyToOne(() => User)//muitos tokens para um user
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    expires_date: Date

    @CreateDateColumn()
    created_at: Date

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }


}

export { UsersTokens }