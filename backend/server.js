// ======================
// Crypto Fix for MongoDB
// ======================
const { webcrypto } = require("crypto");

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// ======================
// Environment Variables
// ======================
require("dotenv").config();

// ======================
// Imports
// ======================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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
      // Allow requests without an origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Added PATCH here

    credentials: true,
  }),
);

// ======================
// Body Parsers
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Upload Directory
// ======================
const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ======================
// Static Uploads
// ======================
app.use("/uploads", express.static(uploadDirectory));

// ======================
// Multer Configuration
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;

    cb(null, filename);
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
// MongoDB Status Route
// ======================
app.get("/api/db-status", (req, res) => {
  res.json({
    success: true,
    connected: mongoose.connection.readyState === 1,
    database: mongoose.connection.name,
    host: mongoose.connection.host,
  });
});

// ==================================================
// 🔐 ADMIN LOGIN
// ==================================================
app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required.",
      });
    }

    // Check admin credentials
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password.",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        username: username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    console.log("🔐 Admin login successful:", username);

    return res.json({
      success: true,
      message: "Admin login successful.",
      token: token,
    });
  } catch (error) {
    console.error("❌ Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      error: "Login failed.",
    });
  }
});

// ==================================================
// 🔐 ADMIN AUTHENTICATION MIDDLEWARE
// ==================================================
function verifyAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Admin authentication required.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("❌ Admin Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired admin session.",
    });
  }
}

// ==================================================
// 📥 ADMISSION SUBMISSION
// ==================================================
app.post(
  ["/api/admissions", "/admissions"],
  upload.single("profilePicture"),

  async (req, res) => {
    try {
      console.log("");
      console.log("====================================");
      console.log("📥 NEW ADMISSION REQUEST");
      console.log("====================================");

      console.log("📦 Form Data:", req.body);
      console.log("📸 Uploaded File:", req.file);

      // Check profile picture
      if (!req.file) {
        console.log("❌ No profile picture received.");

        return res.status(400).json({
          success: false,
          error: "Profile picture is required.",
        });
      }

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error("❌ MongoDB is not connected.");

        return res.status(503).json({
          success: false,
          error: "Database is not connected.",
        });
      }

      // ======================
      // Create Admission
      // ======================
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
        status: "Pending", // Set default status on new admission
      });

      // ======================
      // Save to MongoDB
      // ======================
      const savedAdmission = await newAdmission.save();

      console.log("");
      console.log("====================================");
      console.log("✅ ADMISSION SAVED SUCCESSFULLY!");
      console.log("====================================");

      console.log("🆔 Admission ID:", savedAdmission._id);
      console.log("📚 Collection:", Admission.collection.name);
      console.log("🗄️ Database:", mongoose.connection.name);
      console.log("📧 Email:", savedAdmission.email);

      console.log("====================================");
      console.log("");

      return res.status(201).json({
        success: true,
        message: "Admission application submitted successfully!",
        admissionId: savedAdmission._id,
      });
    } catch (error) {
      console.error("");
      console.error("====================================");
      console.error("❌ ADMISSION SAVE ERROR");
      console.error("====================================");
      console.error(error);
      console.error("====================================");

      return res.status(500).json({
        success: false,
        error: "Failed to submit application.",
        details: error.message,
      });
    }
  },
);

// ==================================================
// 📊 ADMISSION COUNT
// ==================================================
app.get("/api/admissions/count", async (req, res) => {
  try {
    const count = await Admission.countDocuments();

    res.json({
      success: true,
      count: count,
      collection: Admission.collection.name,
      database: mongoose.connection.name,
    });
  } catch (error) {
    console.error("❌ Admission count error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================================================
// 🔐 ADMIN - GET ALL ADMISSIONS
// ==================================================
app.get("/api/admin/admissions", verifyAdmin, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      count: admissions.length,
      admissions: admissions,
    });
  } catch (error) {
    console.error("❌ Get Admissions Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch admissions.",
      details: error.message,
    });
  }
});

// ==================================================
// 🔐 ADMIN - UPDATE ADMISSION STATUS (NEW ROUTE)
// ==================================================
app.patch("/api/admin/admissions/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required.",
      });
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }, // Return the updated document
    );

    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        error: "Admission not found.",
      });
    }

    console.log(`✅ Updated admission ${req.params.id} status to ${status}`);

    return res.json({
      success: true,
      message: "Status updated successfully.",
      admission: updatedAdmission,
    });
  } catch (error) {
    console.error("❌ Update Admission Status Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to update status.",
      details: error.message,
    });
  }
});

// ==================================================
// 📩 CONTACT SUBMISSION
// ==================================================
app.post(
  ["/api/contact", "/contact"],

  async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      console.log("📩 New contact message:", {
        name,
        email,
      });

      if (!name || !email || !phone || !message) {
        return res.status(400).json({
          success: false,
          error: "All fields are required.",
        });
      }

      const newContact = new Contact({
        name,
        email,
        phone,
        message,
      });

      const savedContact = await newContact.save();

      console.log("✅ Contact saved:", savedContact._id);

      return res.status(201).json({
        success: true,
        message: "Message sent successfully!",
      });
    } catch (error) {
      console.error("❌ Contact Error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to send message.",
        details: error.message,
      });
    }
  },
);

// ==================================================
// 🔐 ADMIN - GET ALL CONTACT MESSAGES
// ==================================================
app.get("/api/admin/contacts", verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      count: contacts.length,
      contacts: contacts,
    });
  } catch (error) {
    console.error("❌ Get Contacts Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch contact messages.",
      details: error.message,
    });
  }
});

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

// ==================================================
// MongoDB Connection + Start Server
// ==================================================
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined!");
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined!");
      process.exit(1);
    }

    if (!process.env.ADMIN_USERNAME) {
      console.error("❌ ADMIN_USERNAME is not defined!");
      process.exit(1);
    }

    if (!process.env.ADMIN_PASSWORD) {
      console.error("❌ ADMIN_PASSWORD is not defined!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "hk_korean",
    });

    console.log("");
    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully!");
    console.log("🗄️ Database:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("====================================");
    console.log("");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("");
    console.error("====================================");
    console.error("❌ MongoDB Connection Error");
    console.error("====================================");
    console.error(error);
    console.error("====================================");

    process.exit(1);
  }
}

startServer();
