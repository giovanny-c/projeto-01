import { IFindOptions } from "../../donations/dtos/IFindOptionsDTO"
import { Worker } from "../entities/worker"


interface IWorkersReposiroty {
    create(name: string, id?: string): Promise<Worker>
    findById(id: string): Promise<Worker>
    findByName(name: string): Promise<Worker>
    find(): Promise<Worker[]>

}

export { IWorkersReposiroty }