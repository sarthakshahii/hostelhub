import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    capacity: { type: Number, required: true },

    wardenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Hostel || mongoose.model("Hostel", HostelSchema);
