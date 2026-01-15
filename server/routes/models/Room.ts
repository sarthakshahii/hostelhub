import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    number: { type: String, required: true },

    capacity: { type: Number, required: true },

    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
