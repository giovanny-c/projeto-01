import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { MailProvider } from "./implementations/MailProvider";
import { SendGridMailProvider } from "./implementations/SendGridMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";


const mailprovider = {

    ses: SESMailProvider,
    sendgrid: SendGridMailProvider,
    nodemailer: MailProvider

}

// ou register instance?
container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(mailprovider[process.env.MAIL_PROVIDER])
)