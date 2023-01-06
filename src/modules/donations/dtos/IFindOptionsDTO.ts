interface IFindOptions {
    ngo_id?: string
    value?: string
    orderBy?: string
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    donation_number_interval?: number[]

}

export { IFindOptions }