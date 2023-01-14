
declare namespace Express {

    export interface Request {
        user: {
            id: string
            admin?: boolean
        }
       
        session: Session & Partial<SessionData> & CustomSessionFields
    }


}