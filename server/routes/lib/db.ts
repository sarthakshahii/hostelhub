import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env manually from root
const envPath = path.resolve(__dirname, "../../../.env");

interface EnvVars {
  [key: string]: string;
}

const loadEnv = (): EnvVars => {
  const envVars: EnvVars = {};
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        
        const [key, ...valueParts] = trimmed.split("=");
        let value = valueParts.join("=").trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        envVars[key.trim()] = value;
      }
    }
  } catch (error) {
    console.error("[DB] Error loading .env file:", error);
  }
  return envVars;
};

const envVars = loadEnv();

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const uri = envVars.MONGODB_URI || process.env.MONGODB_URI;
    
    if (!uri) {
      console.error("[DB] ERROR: MONGODB_URI not found!");
      throw new Error("MONGODB_URI is not defined");
    }
    
    console.log("[DB] Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("[DB] ✓ Connected Successfully");
  } catch (error) {
    console.error("[DB] Connection Error:", error instanceof Error ? error.message : error);
    throw error;
  }
};
