import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import { studentController } from "./controllers/studentController.ts";
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.listen(port);
