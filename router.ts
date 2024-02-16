import { Router } from "express" 
import { RedirectUrl, ShortenUrl } from "./controller/UrlController"

export const router = Router()

router.post("/shorten-url", ShortenUrl)
router.get("/:uid", RedirectUrl)