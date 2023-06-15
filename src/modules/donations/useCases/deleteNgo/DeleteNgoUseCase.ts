import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { INgoRepository } from "../../repositories/INgoRepository";
import * as uuid from "uuid"
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { validatePassword } from "../../../../utils/passwordUtils";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";

interface IRequest{
    
    ngo_id: string
    user_id: string
    password: string
    delete_name: string
}

@injectable()
class DeleteNgoUseCase{

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        
    ){

    }

    async execute({ngo_id, user_id, password, delete_name}:IRequest){

        if(!ngo_id || uuid.validate(ngo_id) === false) throw new AppError("Não foi possivel encontrar a instituição")
        if(!user_id || uuid.validate(user_id) === false) throw new AppError("Usuario nao encontrado")
        if(!password) throw new AppError("Forneça sua senha para deletar a instituição")

        const ngo = await this.ngoRepository.findById(ngo_id)

        if(!ngo) throw new AppError("Instituição nao encontrada")

        const user = await this.usersRepository.findById(user_id)

        if(!user) throw new AppError("Usuario nao encontrado")

        if(!user.master){
            throw new AppError("Não é possivel deletar essa instituição. Apenas o admin master pode faze-lo.")
        }

        if(ngo.full_name !== delete_name){
            throw new AppError("Não foi possível deletar a instituição. O nome da instituição esta errado.")
        }

        if(!validatePassword(password, user.salt, user.password_hash)){
            throw new AppError("Senha incorreta", 400)
        }

        const counter = await this.donationCounterRepository.findByNgoId(ngo.id)
        if(counter) await this.donationCounterRepository.delete(counter.id)
        
        await this.ngoRepository.delete(ngo.id)

        await this.cacheProvider.delete(`ngo-${ngo.id}`)
        
        
    }
}

export {DeleteNgoUseCase}