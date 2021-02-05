import User from "../models/user";

import { createToken, maxAge } from "../lib/tokenCreater";
import hashPassword from "../lib/hashPassword";
import {
  handleError,
  UserValidationError,
  validateUserName,
  validatePassword,
} from "../lib/validators";

export const post_update_username = async (req, res) => {
  const { username = "" } = req.body;
  try {
    if (req._user_ === null) {
      res.status(401);
      throw new UserValidationError("username", "unauthorized user");
    }
    //validateUserName throw an error if username is not valid and executes callback
    validateUserName(username, () => res.status(400));

    const user = await User.findOne({ username: req._user_.username });
    if (user === null) {
      res.status(401);
      throw new UserValidationError("username", "unauthorized user");
    }
    await User.updateOne({ username: req._user_.username }, { username });
    user.username = username;
    res.cookie("jwt", createToken({ id: user._id, username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.json({ user });
    // console.log(user);
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.json({ errors });
  }
};

export const post_update_password = async (req, res) => {
  const { password = "" } = req.body;
  try {
    if (req._user_ === null) {
      res.status(401);
      throw new UserValidationError("username", "unauthorized user");
    }

    //validatePassword throw an error if password is not valid and executes callback
    validatePassword(password, () => res.status(400));
    const user = await User.findOne({ username: req._user_.username });

    if (user === null) {
      res.status(401);
      throw new UserValidationError("username", "unauthorized user");
    }
    const hashedPassword = await hashPassword(password);
    await User.updateOne(
      { username: user.username },
      { $set: { hashedPassword } }
    );
    // console.log(user);
    res.status(201);
    res.cookie("jwt", createToken({ id: user._id, username: user.username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.json({ user });
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.json({ errors });
  }
};

export const delete_remove_user = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req._user_.username });
    if (user) {
      res.cookie("jwt", "", { maxAge: 1 });
      res.json({});
    } else res.status(500);
  } catch (e) {
    res.status(500);
    res.end();
  }
};

export const get_user_info = async (req, res) => {
  // console.log(req._user_);
  if (req._user_) {
    const user = await User.findOne(
      { username: req._user_.username },
      { password: 0 }
    );
    res.json({ user });
  } else {
    res.json({ user: null });
  }
};
export const get_users_info = async (req, res) => {
  const users = await User.find({}, { password: 0 });
  // console.log(users);
  res.json(users);
};
