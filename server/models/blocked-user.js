import mongoose from "mongoose";

const BlockedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  username: { type: String, required: true },
});

const BlockedUser = mongoose.model("blocked_user", BlockedUserSchema);

export default BlockedUser;
