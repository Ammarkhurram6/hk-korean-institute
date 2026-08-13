const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, required: true },
  identityType: { type: String, required: true }, // CNIC or Passport
  identityNumber: { type: String, required: true },
  course: { type: String, required: true },
  occupation: { type: String, required: true },
  occupationOther: { type: String }, // Optional, only if 'Other' is selected
  studiedKoreanBefore: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String, required: true }, // This will store the image filename/path
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Admission", admissionSchema);
