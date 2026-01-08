import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import requestRouter from "./routes/requestRouter.js";
import bookRouter from "./routes/bookRouter.js";
import orderRouter from "./routes/orderRouter.js";
import cookieParser from "cookie-parser";
import path from 'path';
import dotenv from "dotenv";
dotenv.config();


const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.BASE_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/book", bookRouter);
app.use("/order", orderRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get(/(.*)/,(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log("connected to mngodb successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR : FAILED TO CONNECT TO MONGODB ", err);
  });
