

interface IDateProvider {

    dateNow(): Date
    convertToDate(date: string): Date


}

export { IDateProvider }