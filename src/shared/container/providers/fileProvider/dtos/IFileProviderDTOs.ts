import { Donation } from "../../../../../modules/donations/entities/donation"


interface IGenerateFile {

    donation: Donation
    saveFile?: boolean
    generateForBooklet?: boolean

}

interface ICreateBooklet {
    donations: Donation[] 
    saveFile: boolean 
}

export {IGenerateFile, ICreateBooklet}