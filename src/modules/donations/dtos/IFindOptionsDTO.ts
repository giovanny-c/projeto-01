interface IFindOptions {
    ngo_id?: string
    value?: string
    donor_name?: string
    worker_name?: string
    orderBy?: string
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    donation_number?: number
    donation_number_interval?: number[]

}

export { IFindOptions }