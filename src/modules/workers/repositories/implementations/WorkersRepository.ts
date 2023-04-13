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

    async findWithRelations(): Promise<Worker[]> {
        const workers = await this.repository.find({
            relations: {
                user: true
            }
        })
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

        const worker = await this.repository.findOne({  
            where: {id}
        })

        return worker
    }

    async findByIdWithRelations(id: string): Promise<Worker> {

        const worker = await this.repository.findOne({
            relations: {
                user: true
            },
            where: {id}
        })

        return worker
    }

    async findByName(name: string): Promise<Worker> {
        const worker = await this.repository.findOne({where: {name}})

        return worker
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}

export { WorkersRepository }