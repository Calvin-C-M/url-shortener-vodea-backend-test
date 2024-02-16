import { nanoid } from "nanoid"

export function urlIsValid(url: string) {
    const regex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gim

    return regex.test(url)
}

export function handleUrlId(customId: string | undefined) {
    if(customId) {
        if(customId.length > 16) {
            return ""
        }
        return customId
    } 
    return nanoid(6)
}