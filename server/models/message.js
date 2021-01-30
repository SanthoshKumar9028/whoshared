import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  body: String,
  sentDate: Date,
});

const Message = mongoose.model("message", messageSchema);

export default Message;
