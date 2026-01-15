import express, { Express, Router } from "express";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

// Import route handlers
import { register, login, me, seedDemoUsers } from "./routes/auth";
import { listUsers, updateUser } from "./routes/users";
import { createHostel, listHostels, assignWarden } from "./routes/hostels";
import { createRoom, listRooms, allocateRoom } from "./routes/rooms";
import { createComplaint, listComplaints, updateComplaint } from "./routes/complaints";
import { markAttendance, viewAttendance } from "./routes/attendance";
import { getStats, getWardenStats, getResidentStats } from "./routes/dashboard";

export function createServer(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
  });

  // Auto-seed demo users on first server start
  (async () => {
    try {
      const { connectDB } = await import("./routes/lib/db");
      await connectDB();
      const User = await import("./routes/models/User");
      const UserModel = (User.default || User) as any;
      
      const userCount = await (UserModel.countDocuments() as any);
      if (userCount === 0) {
        const { hashPassword } = await import("./routes/lib/hash");
        const password = await hashPassword("password123");
        
        await UserModel.insertMany([
          { name: "Admin User", email: "admin@hostel.com", password, role: "admin" },
          { name: "Warden User", email: "warden@hostel.com", password, role: "warden" },
          { name: "Student User", email: "student@hostel.com", password, role: "resident" },
        ]);
        
        console.log("✓ Demo users created successfully");
      }
    } catch (error) {
      console.log("[Init] Demo users already exist or seeding skipped");
    }
  })();

  // Auth routes
  const authRouter = Router();
  authRouter.post("/register", register);
  authRouter.post("/login", login);
  authRouter.get("/me", me);
  authRouter.post("/seed-demo-users", seedDemoUsers);
  app.use("/auth", authRouter);

  // User routes
  const userRouter = Router();
  userRouter.get("/", listUsers);
  userRouter.put("/:id", updateUser);
  app.use("/users", userRouter);

  // Hostel routes
  const hostelRouter = Router();
  hostelRouter.post("/", createHostel);
  hostelRouter.get("/", listHostels);
  hostelRouter.post("/:id/assign-warden", assignWarden);
  app.use("/hostels", hostelRouter);

  // Room routes
  const roomRouter = Router();
  roomRouter.post("/", createRoom);
  roomRouter.get("/", listRooms);
  roomRouter.post("/:id/allocate", allocateRoom);
  app.use("/rooms", roomRouter);

  // Complaint routes
  const complaintRouter = Router();
  complaintRouter.post("/", createComplaint);
  complaintRouter.get("/", listComplaints);
  complaintRouter.put("/:id", updateComplaint);
  app.use("/complaints", complaintRouter);

  // Attendance routes
  const attendanceRouter = Router();
  attendanceRouter.post("/", markAttendance);
  attendanceRouter.get("/", viewAttendance);
  app.use("/attendance", attendanceRouter);

  // Dashboard routes
  const dashboardRouter = Router();
  dashboardRouter.get("/stats", getStats);
  dashboardRouter.get("/warden-stats", getWardenStats);
  dashboardRouter.get("/resident-stats", getResidentStats);
  app.use("/dashboard", dashboardRouter);

  // Error handler (before 404)
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  );

  // 404 handler - only for API routes
  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: "Not found" });
    } else {
      // Let Vite handle non-API routes (for dev mode)
      res.status(404).json({ error: "Not found" });
    }
  });

  return app;
}
