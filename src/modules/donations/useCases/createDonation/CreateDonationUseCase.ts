import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { ICreateDonationsDTO } from "../../dtos/ICreateDonationsDTO";
import { Donation } from "../../entities/donation";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    ngo_id:string 
    donor_id:string 
    donor_name: string
    user_id:string 
    worker_id:string 
    donation_value: number
    is_payed: boolean
    payed_at?: Date
    
}

@injectable()
class CreateDonationUseCase {


    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
    ) { }

    async execute({ ngo_id, donor_id, donor_name, user_id, worker_id, donation_value, is_payed, payed_at }: IRequest): Promise<Donation> {

//TESTAR


        const userExists = await this.usersRepository.findById(user_id)
       //const donorExists = await this.donorsRepository.findById(donor_id)
        const workerExists = await this.workersRepository.findById(worker_id)

        if (!userExists) {
            throw new AppError("This user does not exists")

        }

        // if (!donorExists) {
        //     throw new AppError("This donor does not exists")

        // }

        if (!workerExists) {
            throw new AppError("This worker does not exists")

        } 

        const ngo = await this.ngoRepository.findById(ngo_id)

        if(!ngo){
            throw new AppError("This ngo does not exists")
        }
        const {donation_number} = await this.donationCounterRepository.findByNgoId(ngo_id)

        

        if(is_payed && !payed_at){//se for pago mas nao tiver data

            payed_at = this.dateProvider.dateNow()
        }

        const donation = await this.donationsRepository.create({
            ngo_id, 
            worker_id, 
            //donor_id, 
            donor_name,
            user_id, 
            donation_number,
            donation_value,
            is_payed,
            payed_at: payed_at,
            created_at: this.dateProvider.dateNow()
         })

        await this.donationCounterRepository.update(ngo_id, donation_number + 1, donation_number )


        //temporario () fazer ele pegar o recibo usando o db
        const filePath = `./templates/recibo.png` //template do recibo
        
        


        const donationWithRelations = await this.donationsRepository.findOneById(donation.id)

        donationWithRelations.payed_at = this.dateProvider.formatDate(donation.payed_at, "DD/MM/YYYY")

        const pdfBytes = await this.fileProvider.createFile(filePath, donationWithRelations)

        //mandar para uma rota para escolher o dono desse recibo, para mandar o email
        // mandar email do recibo no futuro

        //const buffer = Buffer.from(pdfBytes)

        return donationWithRelations

    }

}

export { CreateDonationUseCase }