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

export const post_block_user = async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.find({ username }, { username: 1 });
    if (!user) {
      res.status(400);
      throw new Error("user not found");
    }
    //to blocking the user
    user = { userId: user[0]._id, username };
    await BlockedUser.create(user);

    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false });
  }
};

export const post_send_warning = async (req, res) => {
  const { userid, message } = req.body;
  try {
    //changing the logined in state
    const result = await User.updateOne(
      { _id: userid },
      { $push: { warnings: { body: message } } }
    );

    console.log(result);
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
  const { userid } = req.params;

  try {
    const result = await User.updateOne(
      { _id: userid },
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
    const result = await User.deleteOne({ _id: req.params.userid });
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
