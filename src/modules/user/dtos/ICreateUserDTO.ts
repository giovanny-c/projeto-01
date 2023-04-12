interface ICreateUserDTO {
    id?: string
    name: string
    password_hash?: string
    salt?: string
    admin: boolean
    email: string
    worker_id?: string 
}

export { ICreateUserDTO }