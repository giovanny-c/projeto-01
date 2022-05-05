
import { inject, injectable } from "tsyringe";

import { Response } from "express";

import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { Donation } from "../../entities/donation";

interface IResponse {

    file: string
    name: string
}

@injectable()
class GenerateReceiptUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("FileProvider")
        private fileProvider: IFileProvider
    ) {

    }

    async execute(id: string, res: Response): Promise<IResponse> {


        const donation = await this.donationsRepository.findOneById(id)

        if (!donation) {
            throw new AppError("This donation does not exists")
        }

        if (donation.is_payed !== true) {
            throw new AppError("Cant generate a receipt of a donation that wasn't payed")
        }
        const filePath = "./templates/recibo.png"

        // const stream = res.writeHead(200, {
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": `attachment;filename=recibo${donation.id}.pdf`,
        // })


        const pdfBytes = await this.fileProvider.createFile(filePath, donation/*,
            (chunk) => stream.write(chunk),
            () => stream.end()*/
        )

        const buffer = Buffer.from(pdfBytes)

        return {
            file: buffer.toString("base64"),
            name: `${donation.donation_number}`
        }







    }


}

export { GenerateReceiptUseCase }