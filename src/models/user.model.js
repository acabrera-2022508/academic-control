import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  courses: {
    type: [
      {
        type: mongoose.Schema.Types.String,
        ref: "Course",
      },
    ],
    required: false,
  },
  role: {
    type: String,
    enum: ["STUDENT", "TEACHER"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
