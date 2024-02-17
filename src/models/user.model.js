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
        type: mongoose.Schema.Types.ObjectId,
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

// userSchema.pre("save", function (next) {
//   if (this.role !== "STUDENT") {
//     this.role = "STUDENT";
//   } else next();
// });

// userSchema.method.verifyRole = function (role) {
//   return this.role === role;
// };

export default mongoose.model("User", userSchema);
