

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
    convertToDate(date: string | Date): Date
    addOrSubtractTime(operation: string, timeUnit: string, amountOfTime: number, date?: string | Date,): Date
    IsToday(date: Date): boolean
    isValidDate(date: string | Date): boolean
    formatDate(date: Date, formatType: string): Date
    splitDate(date: Date): ISplitDateResponse
}

export { IDateProvider, ISplitDateResponse }