import { Donation } from "../../../../modules/donations/entities/donation"


interface IFileProvider {

    createFile(data: Donation): Promise<Uint8Array>
    createBead(data: Donation[]): Promise<Uint8Array>
}

export { IFileProvider }