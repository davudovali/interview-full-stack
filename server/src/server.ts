import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from Flink!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
