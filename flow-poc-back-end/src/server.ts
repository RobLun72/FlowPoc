import "dotenv/config";
import { generateJwt } from "./genJWT.js";

console.log("Server is starting...");

import express, { Request, Response } from "express";
import cors from "cors";

interface reportJwtRequest {
  report: string;
  user: string;
}

const app = express();

const port = 5174;

const allowedOrigins = [process.env.WHITELIST!];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

// Add body parsing middleware
app.use(express.json()); // For parsing application/json
app.use(express.text()); // For parsing text/plain (as you're sending in your frontend)
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.post("/api/tableau/jwt", async (req: Request, res: Response) => {
  const { report, user } = JSON.parse(req.body) as reportJwtRequest;
  console.log("Received request:", req.body, report, user);
  if (!report || !user) {
    return res.status(400).json({ error: "Report and user are required." });
  }
  const jwt = generateJwt(user);
  console.log("Generated JWT:", jwt);

  res.json({ message: "Hello from the server!", jwtToken: jwt });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
