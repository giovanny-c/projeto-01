import {injectable, inject} from "tsyringe"
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

interface IRequest {
    firstNumber: number
    lastNumber: number
    ngo_id: string
}


@injectable()
class GenerateBeadUseCase {

    constructor(
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ){

    }


    async execute({firstNumber, lastNumber, ngo_id}: IRequest):Promise<void>{

        const donations = await this.donationsRepository.findDonationsBy({
            donationNumberInterval: [firstNumber, lastNumber],
            orderBy: "created_at"
        })


    }
}