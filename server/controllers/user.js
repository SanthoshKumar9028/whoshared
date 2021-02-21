import Message from "../models/message";
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
    const filter = { username: req._user_.username };
    const value = { $set: { username } };
    //updating the username
    await User.updateOne(filter, value);

    //updating the username in messages
    await Message.updateMany(filter, value);

    user.username = username;
    res.cookie("jwt", createToken({ id: user._id, username }), {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: true,
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
      secure: true,
    });
    res.json({ user });
  } catch (e) {
    // console.log(e);
    const errors = handleError(e);
    res.json({ errors });
  }
};

export const get_remove_user = async (req, res) => {
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

export const post_report_user = async (req, res) => {
  const { reasons, reportUsername } = req.body;
  try {
    const r = await User.updateOne(
      { username: reportUsername },
      { $push: { reports: { username: req._user_.username, reasons } } }
    );
    console.log(r);
    res.status(201);
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ ok: false });
  }
};

export const get_user_info = async (req, res) => {
  // console.log(req._user_);
  if (req._user_ && req._user_.isBlockedUser === false) {
    const user = await User.findOne(
      { username: req._user_.username },
      { password: 0 }
    );
    res.json({ user });
  } else {
    res.json({ user: null });
  }
};

export const get_user_info_by = async (req, res) => {
  // console.log(req.query);
  if (req._user_) {
    const filter = { [req.query.type]: req.query.value };
    const user = await User.findOne(filter, { password: 0 });
    res.json({ user });
  } else {
    res.json({ user: null });
  }
};

export const get_users_info = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    // console.log(users);
    res.json(users);
  } catch (e) {
    res.status(500);
    res.json([]);
    throw e;
  } finally {
    res.end();
  }
};

export const get_user_states = async (req, res) => {
  try {
    const users = await User.find({}, { logedin: 1, username: 1 });
    // console.log(users);
    res.json(users);
  } catch (e) {
    res.status(500);
    res.json([]);
    throw e;
  } finally {
    res.end();
  }
};

export const get_messages_on = async (req, res) => {
  // console.log(req.query);
  if (req.query.date === undefined) {
    res.status(400);
    res.json([]);
    return;
  }
  const gotDate = new Date(req.query.date);
  // const gotDate = new Date();
  const year = gotDate.getFullYear();
  const month = gotDate.getMonth();
  const date = gotDate.getDate();

  const curDate = new Date(year, month, date, 0, 0, 0);
  const nextDate = new Date(year, month, date + 1, 0, 0, 0);

  try {
    const messages = await Message.find({
      $and: [{ sentDate: { $gte: curDate } }, { sentDate: { $lt: nextDate } }],
    });
    // console.log(messages);
    res.json(messages);
  } catch (e) {
    res.status(500);
    res.json([]);
    throw e;
  } finally {
    res.end();
  }
};

export const get_today_messages = async (req, res) => {
  req.query.date = Date.now();
  get_messages_on(req, res);
};

export const delete_warning = async (req, res) => {
  const { warning_id } = req.params;
  try {
    //changing the logined in state
    const result = await User.updateOne(
      { _id: req._user_.id },
      { $pull: { warnings: { _id: { $eq: warning_id } } } }
    );

    // console.log(result);
    if (result.n > 0) return res.json({ ok: true });
    res.status(400);
  } catch (e) {
    console.log(e);
    if (e.message.includes("Cast to ObjectId failed")) res.status(400);
    else res.status(500);
  }
  res.send({ ok: false });
};
