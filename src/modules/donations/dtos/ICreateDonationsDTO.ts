

interface ICreateDonationsDTO {

    id?: string
    donation_number: number
    user_id: string
    donor_id: string
    worker_id?: string
    ngo_id: string
    donation_value: Number
    created_at?: Date
    is_payed?: boolean
    payed_at?: Date
    is_donation_canceled?: boolean


}

export{ ICreateDonationsDTO}