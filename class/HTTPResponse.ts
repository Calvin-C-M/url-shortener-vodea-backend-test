import { Response } from "express"

/**
 * HTTPHandler Class
 * 
 * A formatted HTTP Response
 * 
 * code = HTTP response code
 * message = Response message
 * error = Error response message
 * data = Response data (if any) 
 */
export class HTTPResponse {
    public code: number
    public message: string
    public error: string
    public data: [] | Object | undefined

    constructor(code: number, message="", data?: Array<any> | Object, error="") {
        this.code = code
        this.message = message
        this.data = data
        this.error = error
    }

    public Response(res:Response) : Response {
        return res.status(this.code).send(this)
    }
}