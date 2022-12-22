interface ICreateUserDTO {
    id?: string
    name: string
    password_hash: string
    salt: string
}

export { ICreateUserDTO }