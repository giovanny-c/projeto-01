

interface ISplitDateResponse{
    year: string
    month: string
    day: string
    hours: string
    minutes: string
    seconds: string
}

interface IDateProvider {

    dateNow(): Date
    compareIfBefore(date1: Date, date2: Date): boolean
    convertToDate(date: string | Date): Date
    addOrSubtractTime(operation: string, timeUnit: string, amountOfTime: number, date?: string | Date,): Date
    IsToday(date: Date): boolean
    isValidDate(date: string | Date): boolean
    formatDate(date: Date, formatType: string): Date
    splitDate(date: Date): ISplitDateResponse
}

export { IDateProvider, ISplitDateResponse }