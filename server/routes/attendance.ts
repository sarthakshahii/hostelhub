import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import Attendance from "./models/Attendance";
import User from "./models/User";
import { getUserFromRequest } from "./lib/verifyToken";

export const markAttendance: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const user: any = getUserFromRequest(req);

    if (!user || (user.role !== "warden" && user.role !== "admin")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { residentId, date, status } = req.body;

    if (!residentId || !date || !status) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const resident = await (User.findById(residentId) as any);
    if (!resident) {
      res.status(404).json({ error: "Resident not found" });
      return;
    }

    // Warden can only mark attendance for residents of their hostel
    if (
      user.role === "warden" &&
      String(resident.hostelId) !== String(user.hostelId)
    ) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const attendance = await (Attendance.findOneAndUpdate as any)(
      { residentId, date },
      { status },
      { upsert: true, new: true }
    );

    res.json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const viewAttendance: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { residentId, startDate, endDate } = req.query;

    if (user.role === "admin") {
      const query: any = {};
      if (residentId) query.residentId = residentId;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const attendance = await Attendance.find(query);
      res.json({ attendance });
      return;
    }

    if (user.role === "warden") {
      const residents = await (User.find({ hostelId: user.hostelId }) as any);
      const residentIds = residents.map((r) => r._id);

      const query: any = { residentId: { $in: residentIds } };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const attendance = await Attendance.find(query);
      res.json({ attendance });
      return;
    }

    if (user.role === "resident") {
      const query: any = { residentId: user.id };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const attendance = await Attendance.find(query);
      res.json({ attendance });
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
