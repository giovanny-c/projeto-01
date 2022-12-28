import { container } from "tsyringe";

import "./providers/Index"

import { IDonationsRepository } from "../../modules/donations/repositories/IDonationsRepository";
import { DonationsRepository } from "../../modules/donations/repositories/implementation/DonationsRepository";

import { IDonorsRepository } from "../../modules/donor/repositories/IDonorsRepository";
import { DonorsRepository } from "../../modules/donor/repositories/implemantations/DonorsRepository";

import { UsersRepository } from "../../modules/user/repositories/implementation/UsersRepository";
import { IUsersRepository } from "../../modules/user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../modules/workers/repositories/IWorkersRepository";
import { WorkersRepository } from "../../modules/workers/repositories/implementations/WorkersRepository";
import { IUsersTokensRepository } from "../../modules/user/repositories/IUsersTokensRepository";
import { UsersTokensRepository } from "../../modules/user/repositories/implementation/UsersTokensRepository";
import { IDonationCounterRepository } from "../../modules/donations/repositories/IDonationCounterRepository";
import { DonationCounterRepository } from "../../modules/donations/repositories/implementation/DonationCounterRepository";
import { INgoRepository } from "../../modules/donations/repositories/INgoRepository";
import { NgoRepository } from "../../modules/donations/repositories/implementation/NgoRepository";



container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
)

container.registerSingleton<IUsersTokensRepository>(
    "UsersTokensRepository",
    UsersTokensRepository
)

container.registerSingleton<IDonorsRepository>(
    "DonorsRepository",
    DonorsRepository
)


container.registerSingleton<IDonationsRepository>(
    "DonationsRepository",
    DonationsRepository
)

container.registerSingleton<IDonationCounterRepository>(
    "DonationCounterRepository",
    DonationCounterRepository
)
container.registerSingleton<INgoRepository>(
    "NgoRepository",
    NgoRepository
)



container.registerSingleton<IWorkersReposiroty>(
    "WorkersRepository",
    WorkersRepository
)