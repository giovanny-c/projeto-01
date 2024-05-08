interface IFindOptions {
    ngo_id?: string
    value?: string
    donor_name?: string
    // worker_name?: string
    worker_id?: string
    orderBy?: "ASC" | "DESC"
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    donation_number?: number
    donation_number_interval?: number[]
    not_email: boolean

}

export { IFindOptions }