import { Between, FindOptionsOrderValue, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { IFindOptions } from "../../../donations/dtos/IFindOptionsDTO";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../IWorkersRepository";


class WorkersRepository implements IWorkersReposiroty {

    private repository: Repository<Worker>

    constructor() {
        this.repository = dataSource.getRepository(Worker)
    }

    async find(): Promise<Worker[]> {
        const workers = await this.repository.find()
        return workers
    }

    async create(name: string, id?: string): Promise<Worker> {
        const worker = this.repository.create({
            id,
            name
        })

        return await this.repository.save(worker)


    }
    async findById(id: string): Promise<Worker> {

        const worker = await this.repository.findOneBy({ id })

        return worker
    }
    async findByName(name: string): Promise<Worker> {
        const worker = await this.repository.findOneBy({ name })

        return worker
    }

}

export { WorkersRepository }