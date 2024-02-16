import { Response, Request } from "express"
import { getDatabase } from "../utils/database"
import { HTTPResponse } from "../class/HTTPResponse"
import dotenv from "dotenv"
import { handleUrlId } from "../utils/url"
import { URL } from "../types/Url"
dotenv.config()

const COLLECTION_NAME = "url"

export async function ShortenUrl(req: Request, res: Response) {
    const body: {
        originUrl: string,
        customId?: string
    } = await req.body

    const uid = handleUrlId(body.customId)
    if(uid == "") {
        return new HTTPResponse(
            400,
            "URL gagal diperpendek",
            [],
            "URL tidak boleh melebihi 16 karakter"
        ).Response(res)
    }

    const baseURL = process.env.BASE_URL
    const shortUrl = `${baseURL}/${uid}`
    const currentDate = new Date()
    const expireDate = new Date(
        currentDate.getFullYear() + 5,
        currentDate.getMonth(), 
        currentDate.getDate(),
    )

    try {

        const database = await getDatabase()
        
        const findUrl = database.collection(COLLECTION_NAME).findOne({
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

        const urlData:URL = {
            idUrl: uid,
            originalUrl: body.originUrl,
            shortenedUrl: shortUrl,
            expireDate: expireDate,
        }

        const insertNewUrl = await database.collection(COLLECTION_NAME).insertOne(urlData)

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

export async function RedirectUrl(req: Request, res: Response) {
    const urlId = req.params.uid

    try {
        const database = await getDatabase()
        const findUrl = await database.collection(COLLECTION_NAME).findOne({
            idUrl: urlId
        })

        if(findUrl) {
            return res.redirect(findUrl.originalUrl)
        } else {
            return new HTTPResponse(
                404,
                "Gagal redirect",
                [],
                "URL tidak dapat ditemukan"
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