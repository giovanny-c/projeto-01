
import { inject, injectable } from "tsyringe";

import { Response } from "express";

import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { document } from "pdfkit/js/page";

@injectable()
class GenerateReceiptUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("FileProvider")
        private fileProvider: IFileProvider
    ) {

    }

    async execute(id: string, res: Response): Promise<void> {


        const donation = await this.donationsRepository.findOneById(id)

        if (!donation) {
            throw new AppError("This donation does not exists")
        }

        //if (donation.is_payed === true) {}

        const filePath = "./templates/recibo.png"

        // const stream = res.writeHead(200, {
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": `attachment;filename=recibo${donation.id}.pdf`,
        // })


        this.fileProvider.createFile(filePath/*,
            (chunk) => stream.write(chunk),
            () => stream.end()*/
        )






    }


}

export { GenerateReceiptUseCase }