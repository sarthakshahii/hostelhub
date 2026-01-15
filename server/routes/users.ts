import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import { getUserFromRequest } from "./lib/verifyToken";
import User from "./models/User";
import Room from "./models/Room";

export const listUsers: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const userData: any = getUserFromRequest(req);
    if (!userData) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (userData.role === "admin") {
      const users = await User.find().select("-password");
      res.json({ users });
      return;
    }

    if (userData.role === "warden") {
      const users = await (User.find({ hostelId: userData.hostelId }) as any).select(
        "-password"
      );
      res.json({ users });
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

export const updateUser: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const userData: any = getUserFromRequest(req);
    if (!userData) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { userId, updates } = req.body;
    if (!userId || !updates) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const userToUpdate = await (User.findById(userId) as any);
    if (!userToUpdate) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // ADMIN: Full update permissions
    if (userData.role === "admin") {
      if (updates.roomId) {
        const room = await (Room.findById(updates.roomId) as any);
        if (!room) {
          res.status(404).json({ error: "Room not found" });
          return;
        }

        if (!room.occupants.includes(userId)) {
          room.occupants.push(userId);
          await room.save();
        }

        userToUpdate.roomId = updates.roomId;
      }

      if (updates.hostelId) {
        userToUpdate.hostelId = updates.hostelId;
      }

      if (updates.role) {
        userToUpdate.role = updates.role;
      }

      if (updates.name) {
        userToUpdate.name = updates.name;
      }

      await userToUpdate.save();
      res.json({ message: "User updated successfully" });
      return;
    }

    // WARDEN: Can only update residents of their hostel
    if (userData.role === "warden") {
      if (String(userToUpdate.hostelId) !== String(userData.hostelId)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (updates.roomId) {
        const room = await (Room.findById(updates.roomId) as any);
        if (!room || String(room.hostelId) !== String(userData.hostelId)) {
          res.status(403).json({ error: "Room not allowed" });
          return;
        }

        room.occupants.push(userId);
        await room.save();

        userToUpdate.roomId = updates.roomId;
        await userToUpdate.save();
      }

      res.json({ message: "User updated successfully" });
      return;
    }

    // Residents cannot update others
    res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
