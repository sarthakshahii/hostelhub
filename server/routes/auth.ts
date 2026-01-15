import { RequestHandler } from "express";
import { connectDB } from "./lib/db";
import User from "./models/User";
import { comparePassword, hashPassword } from "./lib/hash";
import { signToken } from "./lib/auth";
import { getUserFromRequest } from "./lib/verifyToken";

export const register: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existingUser = await (User.findOne({ email }) as any);
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "resident",
    });

    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    res.json({
      message: "User registered successfully",
      token,
      userId: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const user = await (User.findOne({ email }) as any);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      token,
      userId: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const userData = getUserFromRequest(req);

    if (!userData) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await (User.findById((userData as any).id) as any).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const seedDemoUsers: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    // Check if demo users already exist
    const existingAdmin = await (User.findOne({ email: "admin@hostel.com" }) as any);
    const existingWarden = await (User.findOne({ email: "warden@hostel.com" }) as any);
    const existingStudent = await (User.findOne({ email: "student@hostel.com" }) as any);

    if (existingAdmin && existingWarden && existingStudent) {
      res.json({ message: "Demo users already exist" });
      return;
    }

    const hashedPassword = await hashPassword("password123");

    const demoUsers = [
      {
        name: "Admin User",
        email: "admin@hostel.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Warden User",
        email: "warden@hostel.com",
        password: hashedPassword,
        role: "warden",
      },
      {
        name: "Student User",
        email: "student@hostel.com",
        password: hashedPassword,
        role: "resident",
      },
    ];

    const createdUsers = await User.insertMany(
      demoUsers.filter(user => {
        return !(user.email === "admin@hostel.com" && existingAdmin) &&
               !(user.email === "warden@hostel.com" && existingWarden) &&
               !(user.email === "student@hostel.com" && existingStudent);
      })
    );

    res.json({
      message: "Demo users seeded successfully",
      users: createdUsers.map((u: any) => ({ name: u.name, email: u.email, role: u.role })),
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
