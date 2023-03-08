// import { Request, Response } from "express";
// import { container } from "tsyringe";
// import { UpdateDonationStatusUseCase } from "./UpdateDonationStatusUseCase";

// //NAO USADO
// class UpdateDonationStatusController {

//     async handle(req: Request, res: Response): Promise<Response> {

//         const {ngo_id, donation_number} = req.params

//         const updateDonationStatusUseCase = container.resolve(UpdateDonationStatusUseCase)

//         const donation = await updateDonationStatusUseCase.execute(ngo_id, +(donation_number))

//         return res.json(donation)
//     }



// }

// export { UpdateDonationStatusController }