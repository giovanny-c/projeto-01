import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"
import auth from "../../config/auth"
import { AppError } from "../errors/AppError";


interface IPayload {
    sub: string
}


export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        throw new Error("token missing")
    }

    const [, token] = authHeader.split(" ")

    try {
        const { sub: user_id } = verify(
            token,
            auth.secret_token
        ) as IPayload


        req.user = {
            id: user_id
        }

        next()

    } catch (error) {
        throw new AppError("Token invalido", 401)
    }

}

