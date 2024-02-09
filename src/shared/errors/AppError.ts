
export class AppError {
   
    public readonly message: string
    
    public readonly statusCode: number

    public readonly stack: string

    

    constructor( message: string, statusCode = 400, stack?: string) {
        
        this.message = message
        this.statusCode = statusCode
        this.stack = stack
        
    }
}