import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import Room from "./models/Room";
import User from "./models/User";
import Hostel from "./models/Hostel";
import { getUserFromRequest } from "./lib/verifyToken";

export const createRoom: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { hostelId, number, capacity } = req.body;

    if (!hostelId || !number || !capacity) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const hostel = await (Hostel.findById(hostelId) as any);
    if (!hostel) {
      res.status(404).json({ error: "Hostel not found" });
      return;
    }

    // Admin can create in any hostel
    if (user.role === "admin") {
      const room = await Room.create({ hostelId, number, capacity });
      res.json({ message: "Room created", room });
      return;
    }

    // Warden can create only in their hostel
    if (user.role === "warden") {
      if (String(hostel.wardenId) !== String(user.id)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const room = await Room.create({ hostelId, number, capacity });
      res.json({ message: "Room created", room });
      return;
    }

    res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const listRooms: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.role === "admin") {
      const rooms = await (Room.find() as any);
      res.json({ rooms });
      return;
    }

    if (user.role === "warden") {
      const rooms = await (Room.find({ hostelId: user.hostelId }) as any);
      res.json({ rooms });
      return;
    }

    if (user.role === "resident") {
      const rooms = await (Room.find({ hostelId: user.hostelId }) as any);
      res.json({ rooms });
      return;
    }

    res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const allocateRoom: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { residentId, roomId } = req.body;

    if (!residentId || !roomId) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const room = await (Room.findById(roomId) as any);
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const resident = await (User.findById(residentId) as any);
    if (!resident) {
      res.status(404).json({ error: "Resident not found" });
      return;
    }

    // Check capacity
    if (room.occupants.length >= room.capacity) {
      res.status(400).json({ error: "Room is full" });
      return;
    }

    // Admin and warden can allocate
    if (
      user.role === "admin" ||
      (user.role === "warden" && String(room.hostelId) === String(user.hostelId))
    ) {
      if (!room.occupants.includes(residentId)) {
        room.occupants.push(residentId);
        await room.save();
      }

      resident.roomId = roomId;
      await resident.save();

      res.json({ message: "Room allocated successfully" });
      return;
    }

    res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
