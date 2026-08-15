import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import { studentController } from "./controllers/studentController.ts";
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send(`The server is running on port ${port}. Have fun!! =)`);
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.get("/students", (req: Request, res: Response) => {
  return studentController.getAll(req, res);
});

app.post("/students", (req: Request, res: Response) => {
  return studentController.create(req, res);
});

app.get("/students/:id", (req: Request, res: Response) => {
  return studentController.getById(req, res);
});

app.put("/students/:id", (req: Request, res: Response) => {
  return studentController.update(req, res);
});

app.patch("/students/:id", (req: Request, res: Response) => {
  return studentController.update(req, res);
});

app.delete("/students/:id", (req: Request, res: Response) => {
  return studentController.remove(req, res);
});

app.listen(port);
