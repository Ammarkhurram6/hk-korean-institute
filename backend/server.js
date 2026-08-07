// ======================
// Crypto Fix for MongoDB
// ======================
const { webcrypto } = require("crypto");

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// ======================
// Imports
// ======================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const Admission = require("./models/Admission");
const Contact = require("./models/Contact");

// ======================
// App Configuration
// ======================
const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// CORS Configuration
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://hk-korean-institute.vercel.app",
  "https://hk-korean-institute-git-main-ammar-team.vercel.app",
  "https://www.hkkorean.com",
  "https://hkkorean.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // e.g. Postman, mobile apps, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    credentials: true,
  }),
);

// ======================
// Body Parsers
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Static Uploads
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// MongoDB Connection
// ======================
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully!");
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
    });
}

// ======================
// Multer Configuration
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
  res.send("🚀 HK Korean Institute Backend is Running!");
});

// ======================
// Test API Route
// ======================
app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: "Backend and Database are fully connected! 🚀",
  });
});

// ======================
// Admission Route
// ======================
app.post(
  ["/api/admissions", "/admissions"],
  upload.single("profilePicture"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Profile picture is required.",
        });
      }

      const newAdmission = new Admission({
        name: req.body.name,
        fatherName: req.body.fatherName,
        dob: req.body.dob,
        age: req.body.age,
        gender: req.body.gender,
        identityType: req.body.identityType,
        identityNumber: req.body.identityNumber,
        course: req.body.course,
        occupation: req.body.occupation,
        occupationOther: req.body.occupationOther,
        studiedKoreanBefore: req.body.studiedKoreanBefore,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        profilePicture: req.file.filename,
      });

      await newAdmission.save();

      res.status(201).json({
        success: true,
        message: "Admission application submitted successfully!",
      });
    } catch (error) {
      console.error("❌ Admission Error:", error);

      res.status(500).json({
        success: false,
        error: "Failed to submit application.",
      });
    }
  },
);

// ======================
// Contact Route
// ======================
app.post(
  ["/api/contact", "/contact"],

  async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "All fields are required.",
        });
      }

      const newContact = new Contact({
        name,
        email,
        message,
      });

      await newContact.save();

      res.status(201).json({
        success: true,
        message: "Message sent successfully!",
      });
    } catch (error) {
      console.error("❌ Contact Error:", error);

      res.status(500).json({
        success: false,
        error: "Failed to send message.",
      });
    }
  },
);

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

// ======================
// Start Server
// ======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
