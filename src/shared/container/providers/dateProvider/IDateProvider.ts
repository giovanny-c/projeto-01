

interface IDateProvider {

    dateNow(): Date
    convertToDate(date: string | Date): Date
    addOrSubtractTime(operation: string, timeUnit: string, amountOfTime: number, date?: string | Date,): Date
    AddDateIfIsToday(date: Date): boolean
    isValidDate(date: string | Date): boolean

}

export { IDateProvider }