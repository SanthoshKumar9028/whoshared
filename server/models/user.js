import mongoose from "mongoose";
import bcrypt from "bcrypt";

import hashPassword from "../lib/hashPassword";

const reportSchema = new mongoose.Schema({
  username: String,
  reasons: Array,
});

const notificationSchema = new mongoose.Schema({
  type: String,
  body: String,
});

const userSchema = new mongoose.Schema({
  originalname: {
    type: String,
    required: [true, "original name is required"],
    minlength: [5, "original name should be more than 4 charecters"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "user name is required"],
    minlength: [5, "user name should be more than 4 charecters"],
    maxlength: [15, "user name should be less than 16 charecters"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [7, "password should be more than 6 charecters"],
  },
  logedin: {
    type: Boolean,
    default: false,
  },
  isAdmin: Boolean,
  profileImgPath: String,
  reports: [reportSchema],
  notifications: [notificationSchema],
});

//middlewares
//to hash the password
userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

//statics functions
//to verify the user
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    if (await bcrypt.compare(password, user.password)) return user;
    throw new Error("invalid password");
  }
  throw new Error("invalid username");
};

const User = mongoose.model("user", userSchema);

export default User;
