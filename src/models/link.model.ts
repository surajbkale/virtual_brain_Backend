import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const LinkModel = model("Link", LinkSchema);
