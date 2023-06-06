
import { inject, injectable } from "tsyringe";

import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest{
    ngo_id: string
    // year: string
    // month: string
}

interface IResponse{

    ngo: Ngo
    donation_counter: DonationCounter
    // thisMonthBooklets: string[]
    // lastMonthBooklets: string[]
    // thisMonth_Year: string
    // lastMonth_Year: string
}

@injectable()
class LoadGenerateBookletUseCase{

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        ){

    }

    async execute({ngo_id}: IRequest): Promise<IResponse>{
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        
        
        // let {month, year} = this.dateProvider.splitDate(this.dateProvider.dateNow())
        
        // let last_date = this.dateProvider.addOrSubtractTime("sub", "month", 1, this.dateProvider.dateNow())
        
        // let {month: last_month, year: last_year} = this.dateProvider.splitDate(last_date)

        

        // let thisMonthDir = `./tmp/booklet/${year}/${month}/${ngo.name}/`  
        // const thisMonthBooklets = await this.storageProvider.getFileNamesFromDir(thisMonthDir) as string[]
        
        // let lastMonthDir = `./tmp/booklet/${last_year}/${last_month}/${ngo.name}/` 
        // console.log(lastMonthDir)
        // const lastMonthBooklets = await this.storageProvider.getFileNamesFromDir(lastMonthDir) as string[]


       

        const donation_counter = await this.donationCounterRepository.findByNgoId(ngo_id)
        
        return {
            ngo,
            donation_counter,
            // thisMonthBooklets,
            // lastMonthBooklets,
            // thisMonth_Year: `${year}/${month}`,
            // lastMonth_Year: `${last_year}/${last_month}`,
            
        }
        
    }   

}
export{LoadGenerateBookletUseCase}