
declare namespace Express {

    export interface Request {
        user: {
            id: string
            admin: boolean
            error?: {
                message: string
                status: number
            }
            success?: {
                message: string
                status: number
            }
        }
       
        session: Session & Partial<SessionData> & CustomSessionFields
    }


}