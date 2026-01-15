import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import Hostel from "./models/Hostel";
import User from "./models/User";
import { getUserFromRequest } from "./lib/verifyToken";

export const createHostel: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { name, capacity } = req.body;

    if (!name || !capacity) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const hostel = await Hostel.create({ name, capacity });

    res.json({
      message: "Hostel created successfully",
      hostel,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const listHostels: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Admin gets all hostels
    if (user.role === "admin") {
      const hostels = await Hostel.find();
      res.json({ hostels });
      return;
    }

    // Warden gets only their assigned hostel
    if (user.role === "warden") {
      const hostels = await (Hostel.find({ wardenId: user.id }) as any);
      res.json({ hostels });
      return;
    }

    // Resident gets their hostel based on user.hostelId
    if (user.role === "resident") {
      const hostels = await (Hostel.find({ _id: user.hostelId }) as any);
      res.json({ hostels });
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

export const assignWarden: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { hostelId, wardenId } = req.body;

    if (!hostelId || !wardenId) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const hostel = await (Hostel.findById(hostelId) as any);
    if (!hostel) {
      res.status(404).json({ error: "Hostel not found" });
      return;
    }

    const warden = await (User.findById(wardenId) as any);
    if (!warden) {
      res.status(404).json({ error: "Warden not found" });
      return;
    }

    hostel.wardenId = wardenId;
    await hostel.save();

    res.json({
      message: "Warden assigned successfully",
      hostel,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
