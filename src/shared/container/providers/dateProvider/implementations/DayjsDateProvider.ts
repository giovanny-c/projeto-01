import { IDateProvider } from "../IDateProvider"


const dayjs = require("dayjs")

class DayjsDateProvider implements IDateProvider {

    dateNow(): Date {
        return dayjs().toDate()
    }

}

export { DayjsDateProvider }