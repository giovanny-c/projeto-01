

interface ICreateDonationsDTO {

    id?: string
    donation_number?: Number
    user_id: string
    donor_id: string
    donation_value: Number
    is_payed?: boolean
    payed_at?: Date

}