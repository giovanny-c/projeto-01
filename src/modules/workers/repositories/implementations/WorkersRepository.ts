import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../IWorkersRepository";


class WorkersRepository implements IWorkersReposiroty {

    private repository: Repository<Worker>

    constructor() {
        this.repository = dataSource.getRepository(Worker)
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