import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default
  mongoose.models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);
