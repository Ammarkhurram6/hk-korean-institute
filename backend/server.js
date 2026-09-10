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
const Student = require("./models/Student");
// ======================
// Course Fee Structure
// ======================
const COURSE_FEES = {
  "EPS TOPIK": 25000,
  "TOPIK 1": 15000,
  "Basic Korean Language": 25000,
  "Fast-Track Korean (40 Days)": 20000,
};

function getCourseFee(courseName) {
  if (!courseName) return 0;
  if (COURSE_FEES[courseName] !== undefined) return COURSE_FEES[courseName];
  const normalized = String(courseName).toLowerCase().trim();
  const found = Object.keys(COURSE_FEES).find(
    (k) => k.toLowerCase().trim() === normalized,
  );
  return found ? COURSE_FEES[found] : 0;
}
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
// ==================================================
// 🔐 ADMIN - UPDATE ADMISSION STATUS (+ auto student)
// ==================================================
app.patch("/api/admin/admissions/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, error: "Status is required." });
    }

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res
        .status(404)
        .json({ success: false, error: "Admission not found." });
    }

    admission.status = status;
    await admission.save();

    let studentCreated = false;
    let studentId = null;

    if (status === "Accepted") {
      // Duplicate protection: only create if no student exists for this admission
      const existingStudent = await Student.findOne({
        admissionId: admission._id,
      });

      if (!existingStudent) {
        const newStudent = new Student({
          admissionId: admission._id,
          name: admission.name,
          fatherName: admission.fatherName,
          dob: admission.dob,
          age: admission.age,
          gender: admission.gender,
          identityType: admission.identityType,
          identityNumber: admission.identityNumber,
          email: admission.email,
          phone: admission.phone,
          address: admission.address,
          course: admission.course,
          occupation: admission.occupation,
          occupationOther: admission.occupationOther,
          studiedKoreanBefore: admission.studiedKoreanBefore,
          profilePicture: admission.profilePicture,
          admissionDate: admission.createdAt,
          status: "Active",
          totalFee: getCourseFee(admission.course),
          payments: [],
        });

        await newStudent.save();
        studentCreated = true;
        studentId = newStudent._id;
        console.log(
          "🎓 Student record auto-created for admission:",
          admission._id,
        );
      }
    }

    console.log(`✅ Updated admission ${req.params.id} status to ${status}`);

    return res.json({
      success: true,
      message: studentCreated
        ? "Status updated. Student record created automatically."
        : "Status updated successfully.",
      admission,
      studentCreated,
      studentId,
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
// 🎓 ADMIN - STUDENT MANAGEMENT
// ==================================================

// GET all students
app.get("/api/admin/students", verifyAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error("❌ Get Students Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch students." });
  }
});

// GET single student
app.get("/api/admin/students/:id", verifyAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found." });
    }
    return res.json({ success: true, student });
  } catch (error) {
    console.error("❌ Get Student Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch student." });
  }
});

// CREATE student (manual) - accepts multipart with optional profilePicture
app.post(
  "/api/admin/students",
  verifyAdmin,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const b = req.body;

      if (!b.name || !b.name.trim()) {
        return res
          .status(400)
          .json({ success: false, error: "Student name is required." });
      }

      const student = new Student({
        name: b.name,
        fatherName: b.fatherName || "",
        dob: b.dob || "",
        age: b.age || "",
        gender: b.gender || "",
        identityType: b.identityType || "",
        identityNumber: b.identityNumber || "",
        email: b.email || "",
        phone: b.phone || "",
        address: b.address || "",
        course: b.course || "",
        occupation: b.occupation || "",
        occupationOther: b.occupationOther || "",
        studiedKoreanBefore: b.studiedKoreanBefore || "",
        profilePicture: req.file ? req.file.filename : "",
        courseDuration: b.courseDuration || "",
        customDuration: b.customDuration || "",
        joiningDate: b.joiningDate || null,
        lastDay: b.lastDay || null,
        status: b.status || "Active",
        totalFee: b.totalFee ? Number(b.totalFee) : 0,
        notes: b.notes || "",
        payments: [],
      });

      await student.save();

      console.log("🎓 New student created manually:", student.name);

      return res.status(201).json({
        success: true,
        message: "Student created successfully.",
        student,
      });
    } catch (error) {
      console.error("❌ Create Student Error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create student.",
        details: error.message,
      });
    }
  },
);

// UPDATE student (accepts JSON or multipart for photo)
app.put(
  "/api/admin/students/:id",
  verifyAdmin,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found." });
      }

      const b = req.body;

      const updatable = [
        "name",
        "fatherName",
        "dob",
        "age",
        "gender",
        "identityType",
        "identityNumber",
        "email",
        "phone",
        "address",
        "course",
        "occupation",
        "occupationOther",
        "studiedKoreanBefore",
        "courseDuration",
        "customDuration",
        "status",
        "notes",
      ];
      updatable.forEach((key) => {
        if (b[key] !== undefined) student[key] = b[key];
      });

      if (b.totalFee !== undefined) student.totalFee = Number(b.totalFee) || 0;
      if (b.joiningDate !== undefined)
        student.joiningDate = b.joiningDate || null;
      if (b.lastDay !== undefined) student.lastDay = b.lastDay || null;
      if (b.book !== undefined)
        student.book = { ...student.book?.toObject?.(), ...b.book };
      if (req.file) student.profilePicture = req.file.filename;

      await student.save();

      return res.json({
        success: true,
        message: "Student updated successfully.",
        student,
      });
    } catch (error) {
      console.error("❌ Update Student Error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update student." });
    }
  },
);

// DELETE student
app.delete("/api/admin/students/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found." });
    }
    return res.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete Student Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete student." });
  }
});

// ADD payment
app.post("/api/admin/students/:id/payments", verifyAdmin, async (req, res) => {
  try {
    const { amount, date, details } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Valid payment amount is required." });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found." });
    }

    student.payments.push({
      amount: Number(amount),
      date: date || new Date(),
      details: details || "",
    });

    await student.save();

    return res
      .status(201)
      .json({ success: true, message: "Payment added successfully.", student });
  } catch (error) {
    console.error("❌ Add Payment Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to add payment." });
  }
});

// UPDATE payment
app.put(
  "/api/admin/students/:id/payments/:paymentId",
  verifyAdmin,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found." });
      }

      const payment = student.payments.id(req.params.paymentId);
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, error: "Payment not found." });
      }

      const { amount, date, details } = req.body;
      if (amount !== undefined) payment.amount = Number(amount);
      if (date !== undefined && date) payment.date = date;
      if (details !== undefined) payment.details = details;

      await student.save();

      return res.json({
        success: true,
        message: "Payment updated successfully.",
        student,
      });
    } catch (error) {
      console.error("❌ Update Payment Error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update payment." });
    }
  },
);

// DELETE payment
app.delete(
  "/api/admin/students/:id/payments/:paymentId",
  verifyAdmin,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found." });
      }

      student.payments.pull(req.params.paymentId);
      await student.save();

      return res.json({
        success: true,
        message: "Payment deleted successfully.",
        student,
      });
    } catch (error) {
      console.error("❌ Delete Payment Error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete payment." });
    }
  },
);

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
// ==================================================
// 🔐 ADMIN - DELETE ADMISSION
// ==================================================
app.delete("/api/admin/admissions/:id", verifyAdmin, async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        error: "Admission not found.",
      });
    }

    // Optional: Server se profile picture bhi delete kar dein agar mojood ho
    if (admission.profilePicture) {
      const filePath = path.join(uploadDirectory, admission.profilePicture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.log(`🗑️ Deleted admission: ${req.params.id}`);

    return res.json({
      success: true,
      message: "Admission deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete Admission Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete admission.",
    });
  }
});

// ==================================================
// 🔐 ADMIN - DELETE CONTACT MESSAGE
// ==================================================
app.delete("/api/admin/contacts/:id", verifyAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact message not found.",
      });
    }

    console.log(`🗑️ Deleted contact message: ${req.params.id}`);

    return res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete Contact Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete contact message.",
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
