
declare namespace Express {

    export interface Request {
        user: {
            id: string
            name: string
            admin: boolean
            
        }
        ngos: {
            id: string
            name: string
        }[]
        error: {
                message: string
                status: number
        }
        success: {
                message: string
                status: number
        }
        session: Session & Partial<SessionData> & CustomSessionFields
    }


}