import * as stream from "stream"

export default interface IResponse {

    readable: stream.Readable
    file_name: string
    content_type: string
}
