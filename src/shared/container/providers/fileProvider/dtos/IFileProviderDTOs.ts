import { Donation } from "../../../../../modules/donations/entities/donation"
import { INGOtemplateConfig } from "../INGOReceiptProvider"


interface IGenerateFile {

    donation: Donation
    saveFile?: boolean
    generateForBooklet?: boolean
    template_name: string
    template_config: INGOtemplateConfig

}

interface ICreateBooklet {
    donations: Donation[] 
    saveFile?: boolean
    template_name: string
    template_config: INGOtemplateConfig
}

export {IGenerateFile, ICreateBooklet}