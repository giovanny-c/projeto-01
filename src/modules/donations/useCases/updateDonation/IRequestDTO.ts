export default interface IRequest {
    is_donation_canceled: string 
    donation_id: string
    ngo_id:string 
    donor_name: string
    worker_id:string 
    donation_value: number
    donation_date?: Date
    
    
}