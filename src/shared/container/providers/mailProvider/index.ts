import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { GmailMailProvider } from "./implementations/GmailMailProvider";
import { SendGridMailProvider } from "./implementations/SendGridMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";


const mailprovider = {

    ses: SESMailProvider,
    sendgrid: SendGridMailProvider,
    gmail: GmailMailProvider

}

// ou register instance?
container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(mailprovider[process.env.MAIL_PROVIDER])
)