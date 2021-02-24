import User from "../models/user";
import BlockedUser from "../models/blocked-user";

export const get_reports = async (req, res) => {
  if (req._user_.isAdmin == false) {
    res.status(401);
    res.json({ username: "unauthorized user" });
    return;
  }
  const username = req.params.username;
  try {
    const reports = await User.find({ username }, { reports: 1 });
    res.json(reports);
  } catch (e) {
    res.json([]);
  }
};

export const get_all_reports = async (req, res) => {
  if (req._user_.isAdmin == false) {
    res.status(401);
    res.json({ username: "unauthorized user" });
    return;
  }
  try {
    const usersReports = await User.find({}, { reports: 1 });
    //filtering the empty reports
    let reports = usersReports.filter((usersReport) => {
      if (usersReport.reports.length > 0) return true;
      return false;
    });
    res.json(reports);
  } catch (e) {
    res.json([]);
  }
};

export const post_block_user_by = async (req, res) => {
  const { type, value } = req.body;
  const filter = { [type]: value };
  try {
    let user = await User.find(filter, { username: 1 });
    // console.log(user);
    if (user == null || user.length < 1) {
      res.status(400);
      throw new Error("not found");
    }
    //blocking the user by inserting into the blockedusers collection
    user = { userId: user[0]._id, username: user[0].username };
    await BlockedUser.create(user);
    res.json({ ok: true });
    return;
  } catch (e) {
    console.log(e);
    if (e.message.includes("Cast to ObjectId failed")) res.status(400);
    else if (e.message.includes("not found") === false) res.status(500);
  }
  res.json({ ok: false });
};

export const post_send_notification = async (req, res) => {
  const { userId, message, type = "general" } = req.body;
  try {
    //changing the logined in state
    const result = await User.updateOne(
      { _id: userId },
      { $push: { notifications: { type, body: message } } }
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

export const delete_reports = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await User.updateOne(
      { _id: userId },
      { $set: { reports: [] } }
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

export const delete_remove_user = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    // console.log(result);
    if (result.n > 0) {
      res.json({ ok: true });
      return;
    }
    res.status(400);
  } catch (e) {
    console.log(e);
    if (e.message.includes("Cast to ObjectId failed")) res.status(400);
    else res.status(500);
  }
  res.json({ ok: false });
};
