export default interface IRequest {
    ngo_id:string 
    donor_name: string
    user_id:string 
    worker_id:string 
    donation_value: number
    is_payed: string
    donation_date: Date
    payed_at?: Date
    
}