const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    details: { type: String, default: "" },
  },
  { _id: true }
);

const BookSchema = new mongoose.Schema(
  {
    ordered: { type: Boolean, default: false },
    bookName: { type: String, default: "" },
    orderDate: { type: Date, default: null },
    purchaseDate: { type: Date, default: null },
    price: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid"],
      default: "Unpaid",
    },
    details: { type: String, default: "" },
  },
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    // Unique + sparse: allows many manual students with null admissionId,
    // but blocks duplicate records for the same admission.
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      unique: true,
      sparse: true,
      default: null,
    },
    name: { type: String, required: [true, "Student name is required"], trim: true },
    fatherName: { type: String, default: "" },
    dob: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    identityType: { type: String, default: "" },
    identityNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    course: { type: String, default: "" },
    occupation: { type: String, default: "" },
    occupationOther: { type: String, default: "" },
    studiedKoreanBefore: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    admissionDate: { type: Date, default: null },
    courseDuration: { type: String, default: "" },
    customDuration: { type: String, default: "" },
    joiningDate: { type: Date, default: null },
    lastDay: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Active", "Completed", "Dropped", "On Hold"],
      default: "Active",
    },
    totalFee: { type: Number, default: 0 },
    payments: [PaymentSchema],
    book: { type: BookSchema, default: () => ({}) },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);