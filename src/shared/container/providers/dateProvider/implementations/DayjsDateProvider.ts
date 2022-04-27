import { AppError } from "../../../../errors/AppError"
import { IDateProvider } from "../IDateProvider"
var customParseFormat = require('dayjs/plugin/customParseFormat')

const dayjs = require("dayjs")
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat) //para formatar de string pra date

dayjs.tz.setDefault("America/Sao_Paulo")//timezone


class DayjsDateProvider implements IDateProvider {


    addOrSubtractTime(operation: string = ("sub" || "add"), timeUnit: string, amountOfTime: number, date?: string | Date) {
        //adciona ou subtrai tempo de uma data passada ou da data atual
        //timeUnit = "day", "month", "hour" ...
        //amountofTime = 1, 2, 3 ...

        if (!date) {

            let dateNow

            if (operation === "sub") {


                dateNow = dayjs.tz(dayjs().toDate()).subtract(amountOfTime, timeUnit).format("YYYY-MM-DD")

                return dateNow
            }

            dateNow = dayjs.tz(dayjs().toDate()).add(amountOfTime, timeUnit).format("YYYY-MM-DD")

            return dateNow
        }

        if (operation === "sub") {
            date = dayjs(date).subtract(amountOfTime, timeUnit).format("YYYY-MM-DD")


            return date
        }

        date = dayjs(date).add(amountOfTime, timeUnit).format("YYYY-MM-DD")


        return date


    }



    convertToDate(date: string): Date {
        //pega uma data em string e transforma em date
        //se a string nao for valida retorna um erro

        const isValid = dayjs(date, "YYYY-MM-DD").isValid()


        if (!isValid) {

            throw new AppError("this is not a valid date")
        }

        const d = dayjs(date, "YYYY-MM-DD").format("YYYY-MM-DD")


        return d


    }



    dateNow(): Date {

        return dayjs.tz(dayjs().toDate()).format("YYYY-MM-DDTHH:mm:ssZ[Z]")//ISO FORMAT
    }

}

export { DayjsDateProvider }