export default interface IUpdateDonation {

    id: string
    donor_name?: string,
    worker_id?: string,
    donation_value?: number
    is_donation_canceled?: boolean
    created_at?: Date
}