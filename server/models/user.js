import mongoose from "mongoose";
import bcrypt from "bcrypt";

const reportSchema = new mongoose.Schema({
  username: String,
  reasons: Array,
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
  reports: [reportSchema],
});

//middlewares
//to hash the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
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
