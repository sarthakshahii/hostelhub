import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },

    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
  },
  { timestamps: true }
);

export default
  mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
