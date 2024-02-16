import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import { router } from "./router";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(router)

app.get("/", (req: Request, res: Response) => {
  res.send("Nothing to see here");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});