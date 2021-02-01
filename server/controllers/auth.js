import User from "../models/user";
import jwt from "jsonwebtoken";

function handleError(e) {
  let errors = {
    username: "",
    originalname: "",
    password: "",
  };

  //handling errors for login
  if (e.message === "invalid username") {
    errors.username = "invalid username";
    return errors;
  }
  if (e.message === "invalid password") {
    errors.password = "invalid password";
    return errors;
  }

  //handling errors for adding the user
  if (e.code === 11000) {
    errors.username = "user name is alredy taken";
    return errors;
  }

  if (e.message.includes("user validation failed")) {
    Object.values(e.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

const maxAge = 60 * 60 * 24 * 3;

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: maxAge });
}

//to verify the user
export function get_is_user(req, res) {
  res.json({ user: req._user_ });
}

//to add a new user
export async function post_add_user(req, res) {
  const { username, originalname, password } = req.body;
  try {
    const user = await User.create({ username, originalname, password });
    //adding jwt token
    res.cookie("jwt", createToken({ id: user._id, username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(201);
    res.json({ user });
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.status(400);
    res.json({ errors });
  }
}

//to log in the user
export async function post_login_user(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    //adding jwt token
    res.cookie("jwt", createToken({ id: user._id, username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.json({ user });
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.status(400);
    res.json({ errors });
  }
}

export function get_logout_user(req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json({});
  res.end();
}

export default { get_is_user, post_add_user, post_login_user, get_logout_user };
