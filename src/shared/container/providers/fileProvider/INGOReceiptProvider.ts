
import { ICreateBooletResponse } from "./IFileProvider";
import { ICreateReceiptBooklet, IGenerateReceipt } from "./dtos/IReceiptProviderDTOs";


interface INGOReceiptProvider {

    generateReceipt(data: IGenerateReceipt): Promise<Uint8Array>
    createBooklet(data: ICreateReceiptBooklet): Promise<ICreateBooletResponse>
}

export {INGOReceiptProvider}