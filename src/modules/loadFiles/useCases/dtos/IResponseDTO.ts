import * as stream from "stream"



export default interface IResponse {

    response?: {
        readable: stream.Readable
        file_name: string
        content_type: string
    }
    
    
    error?: {
        message: string
        status?: number
    }

}



    
