import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { ICreateDonationsDTO } from "../../dtos/ICreateDonationsDTO";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    ngo_id:string 
    donor_name: string
    user_id:string 
    worker_id:string 
    donation_value: number
    is_payed: string
    payed_at?: Date
    
}


interface IResponse {
    donation: Donation
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
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) { }



    async execute({ ngo_id, donor_name, user_id, worker_id, donation_value, is_payed, payed_at }: IRequest): Promise<IResponse> {


        if(!donor_name) throw new AppError("Forneça um nome para esse doação")
        if(!worker_id) throw new AppError("Forneça o nome de um funcionário para esse doação")
        if(!donation_value) throw new AppError("Forneça um valor para esse doação")




        const userExists = await this.usersRepository.findById(user_id)
       //const donorExists = await this.donorsRepository.findById(donor_id)
        const workerExists = await this.workersRepository.findById(worker_id)

        if (!userExists) {
            throw new AppError("Esse usuario nao existe")

        }

        // if (!donorExists) {
        //     throw new AppError("This donor does not exists")

        // }

        if (!workerExists) {
            throw new AppError("Esse funcionario nao existe")

        } 

        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
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
            is_payed: true,
            payed_at: payed_at,
            created_at: this.dateProvider.dateNow()
         })


        let new_donation_number: number = +(donation_number) + 1

        await this.donationCounterRepository.update(ngo_id, new_donation_number, donation_number )


        const donationWithRelations = await this.donationsRepository.findOneById(donation.id)

        //format para ISO
        donationWithRelations.payed_at = this.dateProvider.formatDate(donation.created_at, "YYYY/MM/DD")

        // let file

        // try {
                
        //     const uint8Array = await this.fileProvider.generateFile(donationWithRelations, true)
            
        //     if(!uint8Array){// se nao tiver template vai retornar sem file
        //         return {
        //             donation: donationWithRelations,
        //             ngo
        //         }
        //     }

        //     file = Buffer.from(uint8Array)

        //     file = file.toString("base64")

        // } catch (error) {
            
        //     throw new AppError("Nao foi possivel gerar o recibo dessa doação", 500)

        // }

        return  {
            
            donation: donationWithRelations,
            
        }
        //mandar para uma rota para escolher o dono desse recibo, para mandar o email
        // mandar email do recibo no futuro
    }

}

export { CreateDonationUseCase }