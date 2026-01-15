import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import Complaint from "./models/Complaint";
import User from "./models/User";
import { getUserFromRequest } from "./lib/verifyToken";

export const createComplaint: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const user: any = getUserFromRequest(req);

    if (!user || user.role !== "resident") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const complaint = await Complaint.create({
      userId: user.id,
      title,
      description,
      status: "pending",
    });

    res.json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const listComplaints: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.role === "admin") {
      const complaints = await (Complaint.find().populate("userId") as any);
      res.json({ complaints });
      return;
    }

    if (user.role === "warden") {
      const residents = await (User.find({ hostelId: user.hostelId }) as any);
      const residentIds = residents.map((r) => r._id);
      const complaints = await (Complaint.find({ userId: { $in: residentIds } }) as any);
      res.json({ complaints });
      return;
    }

    if (user.role === "resident") {
      const complaints = await (Complaint.find({ userId: user.id }) as any);
      res.json({ complaints });
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

export const updateComplaint: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { complaintId, status, response } = req.body;

    if (!complaintId || !status) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const complaint = await (Complaint.findById(complaintId) as any);
    if (!complaint) {
      res.status(404).json({ error: "Complaint not found" });
      return;
    }

    // Only admin and warden can update complaint status
    if (user.role === "admin") {
      complaint.status = status;
      if (response) complaint.response = response;
      await complaint.save();
      res.json({ message: "Complaint updated successfully", complaint });
      return;
    }

    if (user.role === "warden") {
      const complaintUser = await (User.findById(complaint.userId) as any);
      if (String(complaintUser?.hostelId) !== String(user.hostelId)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      complaint.status = status;
      if (response) complaint.response = response;
      await complaint.save();
      res.json({ message: "Complaint updated successfully", complaint });
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
