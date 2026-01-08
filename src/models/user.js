import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]{1,30}$/.test(v);
      },
      message:
        "First name must contain only letters and be no more than 30 characters long",
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]{1,30}$/.test(v);
      },
      message:
        "Last name must contain only letters and be no more than 30 characters long",
    },
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg?semt=ais_hybrid&w=740",
    validate: {
      validator: function (value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
        return true;
      },
    },
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const hashedPassword = user.password;
  const valid = await bcrypt.compare(password, hashedPassword);
  return valid;
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
