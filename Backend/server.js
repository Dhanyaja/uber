import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API Working");
});

connectDB();

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
