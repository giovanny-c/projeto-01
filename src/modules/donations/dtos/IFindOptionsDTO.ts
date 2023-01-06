interface IFindOptions {
    ngo_id?: string
    value?: string
    orderBy?: string
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    donationNumberInterval?: number[]

}

export { IFindOptions }