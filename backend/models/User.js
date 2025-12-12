// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  phone: { type: String, required: false },
}, { timestamps: true });

const Users = mongoose.model("Users", userSchema);
export default Users;
