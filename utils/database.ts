import dotenv from "dotenv"
import { MongoClient } from "mongodb"
dotenv.config()

const URI = process.env.MONGODB_URI || ""
const DB_NAME = (process.env.ENVIRONMENT == "development") ? "test" : "app"
const client = new MongoClient(URI)

export async function getDatabase() {
    const connection = await client.connect()
    const database = connection.db(DB_NAME)

    console.log("Connected to database")

    return database
}

export async function closeConnection() {
    const connection = await client.close()

    console.log("Closed connection to database")

    return connection
}