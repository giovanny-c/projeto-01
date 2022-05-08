import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";



container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(SESMailProvider)
)