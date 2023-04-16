import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";

import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { Worker } from "../../../workers/entities/worker";
import { instanceToPlain } from "class-transformer";

@injectable()
class CreateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
        ) { }

    async execute({ name, email, phone, user_id, worker_id}: ICreateDonorDTO) {

        

        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("formato de Email invalido", 400)
        }

        if (!name || !email || !phone) {
            throw new AppError("Preencha todos os campos")
        }

        const donorAlreadyExists = await this.donorsRepository.findByEmail(email)

        if (donorAlreadyExists) {
            throw new AppError("Esse doador ja existe")

        }

        //arruma o numero
        phone = phone.replace(/[\(\)]/g,"")


        //ve se o user existe
        const checkUser = await this.usersRepository.findById(user_id)

        if(!checkUser){
            throw new AppError("Usuário nao encontrado")
        }



        let worker
        //so para admin
        //se um worker for escolhido
        if(worker_id && worker_id !== ""){

            worker = instanceToPlain(await this.workersRepository.findByIdWithRelations(worker_id)) as Worker
           
            if(!worker) throw new AppError("Funcionário não encontrado")
            
            
            const donor = await this.donorsRepository.create({ 
                name, 
                email, 
                phone, 
                user_id: worker.user? worker.user.id : checkUser.id,
                worker_id: worker.id //poe o id do usuario atrelado ou worker
            })

            return {
                donor
            }
        } 

        //só para users que nao sao admin
        // ou um admin que nao escolheu um worker
        //se o worker nao for escolhido
        if(!worker || worker === ""){


            const donor = await this.donorsRepository.create({ 
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

export { CreateDonorUseCase }