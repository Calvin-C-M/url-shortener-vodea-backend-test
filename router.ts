import { Router } from "express" 
import { ShortenUrl } from "./controller/UrlController"

export const router = Router()

router.post("/shorten-url", ShortenUrl)