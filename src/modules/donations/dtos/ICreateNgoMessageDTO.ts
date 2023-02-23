

interface ICreateNgoMessage {

    id?: string
    ngo_id: string
    name: string
    message: string
    subject: string
    start_date: Date
    end_date: Date

}

export {ICreateNgoMessage}