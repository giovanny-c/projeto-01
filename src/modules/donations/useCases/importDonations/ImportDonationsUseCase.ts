import { inject, injectable } from "tsyringe";

import * as fs from "fs"

import * as xlsx from "xlsx"

import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { dataSource } from "../../../../database";


interface IImportDonation {
    donation_value: number
    donation_number: number,
    user_name: string //worker
    donor_name: string
    email: string
    phone: string
    created_at: Date
    is_payed: boolean
    payed_at: Date
    is_Canceled: boolean
}


@injectable()
class ImportDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProviderRepository: IDateProvider
    ) {

    }

    loadDonations(file: Express.Multer.File) { //talvez tenha que ser asincrona

        const excelData = xlsx.readFile(file.path) //diskstorage

        return Object.keys(excelData.Sheets).map(name => ({
            name,
            data: xlsx.utils.sheet_to_json(excelData.Sheets[name]),
        }))





    }



    async execute(file: Express.Multer.File): Promise<void> {



        const parse = this.loadDonations(file).forEach(async (element) => {

            element.data.forEach(async (obj) => {



                console.log(obj) //
            })
        })





        console.log(parse)



    }

}

export { ImportDonationsUseCase }