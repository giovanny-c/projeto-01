

interface ICreateDonationsDTO {

    id?: string
    donation_number?: Number
    user_id: string
    donor_id: string
    worker_id?: string
    donation_value: Number
    created_at?: Date
    is_payed?: boolean
    payed_at?: Date
    is_donation_canceled?: boolean


}