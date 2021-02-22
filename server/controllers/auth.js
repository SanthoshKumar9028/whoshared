import User from "../models/user";

import { maxAge, createToken } from "../lib/tokenCreater";
import { handleError, UserValidationError } from "../lib/validators";
import BlockedUser from "../models/blocked-user";

//to verify the user
export function get_is_user(req, res) {
  // console.log(req._user_.isBlockedUser);
  res.json({ user: req._user_ });
}

//to add a new user
export async function post_add_user(req, res) {
  const { username, originalname, password, isAdmin = false } = req.body;
  try {
    const user = await User.create({
      username,
      originalname,
      password,
      isAdmin,
    });
    //adding jwt token
    res.cookie("jwt", createToken({ id: user._id, username, isAdmin }), {
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
    //verifing the user is blocked
    const blockedUsers = await BlockedUser.findOne({ username });
    if (blockedUsers) {
      throw new UserValidationError(
        "username",
        "You are temproverly blocked, visit the admin to get more information"
      );
    }

    //changing the logined in state
    await User.updateOne({ username }, { $set: { logedin: true } });

    //adding jwt token
    res.cookie("jwt", createToken({ id: user._id, username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200);
    res.json({ user });
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.status(400);
    res.json({ errors });
  }
}

export async function get_logout_user(req, res) {
  try {
    await User.updateOne(
      { username: req._user_.username },
      { $set: { logedin: false } }
    );
  } catch (e) {
    //for handling errors
  } finally {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({});
    res.end();
  }
}

export default { get_is_user, post_add_user, post_login_user, get_logout_user };
