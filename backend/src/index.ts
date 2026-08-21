import express, { type Express, type Request, type Response } from "express";
import "dotenv/config";
import { studentController } from "./controllers/studentController.ts";
import { userController } from "./controllers/userController.ts";
import { authenticate } from "./security/auth.ts";
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(`The server is running on port ${port}. Have fun!! =)`);
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.get("/students", authenticate, (req: Request, res: Response) => {
  return studentController.getAll(req, res);
});

app.post("/students", authenticate, (req: Request, res: Response) => {
  return studentController.create(req, res);
});

app.get("/students/stats", authenticate, (req: Request, res: Response) => {
  return studentController.getStats(req, res);
});

app.get("/students/:id", authenticate, (req: Request, res: Response) => {
  return studentController.getById(req, res);
});

app.put(
  "/students/:id",
  authenticate,
  (req: Request<{ id: string }>, res: Response) => {
    return studentController.update(req, res);
  },
);

app.patch(
  "/students/:id",
  authenticate,
  (req: Request<{ id: string }>, res: Response) => {
    return studentController.update(req, res);
  },
);

app.delete("/students/:id", authenticate, (req: Request, res: Response) => {
  return studentController.remove(req, res);
});

app.post("/auth/register", (req: Request, res: Response) => {
  return userController.register(req, res);
});

app.post("/auth/login", (req: Request, res: Response) => {
  return userController.login(req, res);
});

app.listen(port);
