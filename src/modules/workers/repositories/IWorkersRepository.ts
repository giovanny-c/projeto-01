import { Worker } from "../entities/Worker"


interface IWorkersReposiroty {
    create(name: string, id?: string): Promise<void>
    findById(id: string): Promise<Worker>
    findByName(name: string): Promise<Worker>
}

export { IWorkersReposiroty }