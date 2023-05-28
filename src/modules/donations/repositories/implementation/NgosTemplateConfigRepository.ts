import { Repository } from "typeorm";
import ICreateNgoTemplateConfig from "../../dtos/ICreateNgoTemplateConfigDTO";
import { NgosTemplateConfig } from "../../entities/ngos_template_config";
import { INgosTemplateConfigRepository } from "../INgosTemplateConfigRepository";
import { dataSource } from "../../../../database";


class NgosTemplateConfigRepository implements INgosTemplateConfigRepository{
    
    private repository: Repository<NgosTemplateConfig>

    constructor(){

        this.repository = dataSource.getRepository(NgosTemplateConfig)
    }



    async save({configuration, ngo_id, id}: ICreateNgoTemplateConfig): Promise<NgosTemplateConfig> {

        const config = this.repository.create({
            id,
            ngo_id,
            configuration
        })

        return await this.repository.save(config)

    }
    async findByNgoId(ngo_id: string): Promise<NgosTemplateConfig> {

        return await this.repository.findOneBy({ngo_id})
    }

}

export{NgosTemplateConfigRepository}