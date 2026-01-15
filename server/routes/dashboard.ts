import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import User from "./models/User";
import Hostel from "./models/Hostel";
import Room from "./models/Room";
import Complaint from "./models/Complaint";
import Attendance from "./models/Attendance";
import { getUserFromRequest } from "./lib/verifyToken";

export const getStats: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const stats = {
      users: {
        total: await User.countDocuments(),
        admin: await User.countDocuments({ role: "admin" }),
        warden: await User.countDocuments({ role: "warden" }),
        resident: await User.countDocuments({ role: "resident" }),
      },
      hostels: {
        total: await Hostel.countDocuments(),
      },
      rooms: {
        total: await Room.countDocuments(),
        occupied: await Room.countDocuments({
          occupants: { $exists: true, $gt: { $size: 0 } },
        }),
      },
      complaints: {
        total: await Complaint.countDocuments(),
        open: await Complaint.countDocuments({ status: "open" }),
        closed: await Complaint.countDocuments({ status: "closed" }),
      },
      attendance: {
        total: await Attendance.countDocuments(),
      },
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getWardenStats: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user || user.role !== "warden") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const hostel = await Hostel.findById(user.hostelId);
    if (!hostel) {
      res.status(404).json({ error: "Hostel not found" });
      return;
    }

    const residents = await User.countDocuments({
      hostelId: user.hostelId,
      role: "resident",
    });
    const rooms = await Room.countDocuments({ hostelId: user.hostelId });
    const complaints = await Complaint.countDocuments({
      hostelId: user.hostelId,
    });

    const stats = {
      hostel: hostel.name,
      residents,
      rooms,
      complaints,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getResidentStats: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const resident = await User.findById(user.id);
    if (!resident) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const attendance = await Attendance.countDocuments({
      residentId: user.id,
    });
    const presentDays = await Attendance.countDocuments({
      residentId: user.id,
      status: "present",
    });

    const stats = {
      roomNumber: resident.roomId ? "Assigned" : "Not assigned",
      attendanceRate: attendance > 0 ? (presentDays / attendance) * 100 : 0,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
