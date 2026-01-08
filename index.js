import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import authRouter from "./src/routes/authRouter.js";
import profileRouter from "./src/routes/profileRouter.js";
import requestRouter from "./src/routes/requestRouter.js";
import bookRouter from "./src/routes/bookRouter.js";
import orderRouter from "./src/routes/orderRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/book", bookRouter);
app.use("/order", orderRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});


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
