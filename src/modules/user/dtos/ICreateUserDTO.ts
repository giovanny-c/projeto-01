import { Worker } from "../../workers/entities/worker"

interface ICreateUserDTO {
    id?: string
    name: string
    password_hash?: string
    salt?: string
    admin: boolean
    email: string
    worker_id?: string 
    worker: Worker
}

export { ICreateUserDTO }