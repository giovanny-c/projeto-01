interface ICreateDonorDTO {

    id?: string
    name?: string
    email?: string
    phone?: string
    last_donation?: Date
    user_id?: string
    worker_id?: string
    send_by_message?: boolean


}

export { ICreateDonorDTO }