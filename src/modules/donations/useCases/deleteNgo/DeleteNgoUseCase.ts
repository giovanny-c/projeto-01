import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { INgoRepository } from "../../repositories/INgoRepository";
import uuid from "uuid"
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { validatePassword } from "../../../../../utils/passwordUtils";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";

interface IRequest{
    
    ngo_id: string
    user_id: string
    password: string
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

    async execute({ngo_id, user_id, password}:IRequest){

        if(!ngo_id || !uuid.validate(ngo_id)) throw new AppError("Não foi possivel encontrar a instituição")
        if(!user_id || !uuid.validate(user_id)) throw new AppError("Usuario nao encontrado")
        if(!password) throw new AppError("Forneça uma senha para deletar a instituição")

        const ngo = await this.ngoRepository.findById(ngo_id)

        if(!ngo) throw new AppError("Instituição nao encontrada")

        const user = await this.usersRepository.findById(user_id)

        if(!user) throw new AppError("Usuario nao encontrado")

        if(!validatePassword(password, user.salt, user.password_hash)){
            throw new AppError("Senha incorreta", 400)
        }

        await this.donationCounterRepository.delete(ngo_id)
        await this.ngoRepository.delete(ngo_id)

        await this.cacheProvider.delRedis(`ngo-${ngo.id}`)
        
        
    }
}

export {DeleteNgoUseCase}