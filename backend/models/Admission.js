const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, required: true },
  identityType: { type: String, required: true },
  identityNumber: { type: String, required: true },
  course: { type: String, required: true },
  occupation: { type: String, required: true },
  occupationOther: { type: String },
  studiedKoreanBefore: { type: String, required: true },
  classMode: { type: String, default: "Physical" },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String, required: true },

  // ✅ NAYE COLUMNS RECEIPT KE LIYE
  feeReceipt: { type: String, default: null }, // Receipt image ka path
  paymentStatus: { type: String, default: "Unpaid" }, // Paid, Unpaid, ya Pending Verification

  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Admission", admissionSchema);
