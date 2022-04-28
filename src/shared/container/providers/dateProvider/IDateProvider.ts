

interface IDateProvider {

    dateNow(): Date
    convertToDate(date: string): Date
    addOrSubtractTime(operation: string, timeUnit: string, amountOfTime: number, date?: string | Date,): Date
    AddDateIfIsToday(date: Date): boolean

}

export { IDateProvider }