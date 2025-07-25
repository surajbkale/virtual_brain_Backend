import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

const shareLinkSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const shareLinkModel = model("ShareLink", shareLinkSchema);
