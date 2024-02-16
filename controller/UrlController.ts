import { Response, Request } from "express"
import { nanoid } from "nanoid"
import { getDatabase } from "../utils/database"
import { HTTPResponse } from "../models/HTTPResponse"
import dotenv from "dotenv"
dotenv.config()

export async function ShortenUrl(req: Request, res: Response) {
    const body: {
        originUrl: string
    } = await req.body

    try {
        const baseURL = process.env.BASE_URL
        const uid = nanoid(6)
        const shortUrl = `${baseURL}/${uid}`

        const currentDate = new Date()
        const expireDate = new Date(
            currentDate.getFullYear() + 5,
            currentDate.getMonth(),
            currentDate.getDate(),
        )

        const database = await getDatabase()
        
        const findUrl = database.collection("url").findOne({
            idUrl: uid
        })

        if(!findUrl) {
            return new HTTPResponse(
                409,
                "URL tidak dapat diperpendek",
                [],
                `${shortUrl} sudah digunakan`
            ).Response(res)
        }

        const insertNewUrl = await database.collection("url").insertOne({
            originalUrl: body.originUrl,
            shortenedUrl: shortUrl,
            expireDate: expireDate,
        })

        if(insertNewUrl.acknowledged) {
            return new HTTPResponse(
                200, 
                "URL berhasil diperpendek", 
                {
                    url: shortUrl,
                    expireDate: expireDate
                }
            ).Response(res)
        } else {
            return new HTTPResponse(
                400,
                "URL gagal diperpendek",
                [],
                "Ada masalah dengan database"
            ).Response(res)
        }

    } catch(err) {
        console.error(err)
        return new HTTPResponse(
            500,
            "INTERNAL SERVER ERROR",
            [],
            (err as Error).message
        ).Response(res)
    }
}