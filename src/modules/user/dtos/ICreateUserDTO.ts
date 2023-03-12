interface ICreateUserDTO {
    id?: string
    name: string
    password_hash?: string
    salt?: string
    admin: boolean
    email: string
    is_confirmed?: boolean
}

export { ICreateUserDTO }