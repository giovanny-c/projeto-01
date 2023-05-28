import ICreateNgoTemplateConfig from "../dtos/ICreateNgoTemplateConfigDTO";
import { NgosTemplateConfig } from "../entities/ngos_template_config";



interface INgosTemplateConfigRepository {


    save(data: ICreateNgoTemplateConfig): Promise<NgosTemplateConfig>
    findByNgoId(ngo_id: string): Promise<NgosTemplateConfig>

}

export {INgosTemplateConfigRepository}