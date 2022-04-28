import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("workers")
class Worker {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Date
}

export { Worker }