import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "warden", "resident"],
      default: "resident",
    },

    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
