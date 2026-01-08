import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
export const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie) {
      console.log("ERROR : COOKIE NOT FOUND");
      return res.status(401).json({ message: "Authentication cookie missing" });
    }
    const { token } = cookie;
    if (!token) {
      console.log("ERROR : TOKEN NOT FOUND");
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(
      "ERROR : USER AUTHENTICATION FAILED AT MIDDLEWARE",
      error.message
    );
    res.status(400).json({ message: "User Authentication Failed" });
  }
};
