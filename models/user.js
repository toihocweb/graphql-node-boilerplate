import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
