import { AppError } from "../../../../errors/AppError"
import { IDateProvider } from "../IDateProvider"
var customParseFormat = require('dayjs/plugin/customParseFormat')

const dayjs = require("dayjs")

dayjs.extend(customParseFormat)



class DayjsDateProvider implements IDateProvider {



    convertToDate(date: string): Date {

        const isValid = dayjs(date, "YYYY-MM-DD").isValid()


        if (!isValid) {

            throw new AppError("this is not a valid date")
        }

        const d = dayjs(date, "YYYY-MM-DD")

        return d.$d


    }



    dateNow(): Date {
        return dayjs().toDate()
    }

}

export { DayjsDateProvider }