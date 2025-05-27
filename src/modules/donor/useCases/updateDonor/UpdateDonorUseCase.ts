import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { instanceToPlain } from "class-transformer";
import formatPhone from "../../../../utils/formatPhone";

@injectable()
class UpdateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {
    }

    async execute({ id, name, email, phone, user_id, worker_id, send_by_message }: ICreateDonorDTO) {

        email = email.toLowerCase() as string

        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("formato de Email invalido", 400)
        }

        const donorExists = await this.donorsRepository.findById(id)

        if (!donorExists) {
            throw new AppError("Doador nao encontrado", 404)
        }

        

        phone = formatPhone(phone, false)
        
        //Refazer
        if (!name || name === "") name = donorExists.name
        if (!email) email = donorExists.email
        if (!phone || phone === "") phone = donorExists.phone

        //ve se o user existe
        const checkUser = await this.usersRepository.findById(user_id)

        if(!checkUser){
            throw new AppError("Usuário nao encontrado")
        }

        if(!checkUser.admin){
            throw new AppError("Apenas admins podem fazer alterações")
        }

        let worker
        
        //se um worker for escolhido
        if(worker_id && worker_id !== ""){

            worker = instanceToPlain(await this.workersRepository.findByIdWithRelations(worker_id)) as Worker
           
            if(!worker) throw new AppError("Funcionário não encontrado")
            
            
            const donor = await this.donorsRepository.create({ 
                id: donorExists.id,
                name, 
                email, 
                phone, 
                user_id: worker.user? worker.user.id : checkUser.id, //se o worker nao estiver atrelado a um user, vai ser usado o id do admin
                worker_id: worker.id, //poe o id do usuario atrelado ou worker
                send_by_message: send_by_message? true : false

            })

            return {
                donor
            }
        } 

        
        
        //se o worker nao for escolhido
        if(!worker || worker === ""){


            const donor = await this.donorsRepository.create({ 
                id: donorExists.id,
                name, 
                email, 
                phone, 
                user_id: checkUser.id,
                worker_id: checkUser.worker_id || null
                //se for um user sem worker_id o valor e nulo
                //se for um user com worker poe o id dele
            })

            return {
                donor
            }
        }
        

        
    }
}

export { UpdateDonorUseCase }