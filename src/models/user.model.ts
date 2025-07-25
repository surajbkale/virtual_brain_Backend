import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});


export const UserModel = model('User', userSchema);
