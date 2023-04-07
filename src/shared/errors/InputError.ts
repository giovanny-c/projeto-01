
export class InputError {
   
    public readonly message: string
    
    public readonly statusCode: number

    public readonly inputValues: Object
    

    constructor( message: string, inputValues: Object, statusCode = 400 ){
        
        this.message = message
        this.statusCode = statusCode
        this.inputValues = inputValues
        
    }
}