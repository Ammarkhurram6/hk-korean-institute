import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API_URL from "../config";
import html2pdf from "html2pdf.js";

function Admission() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    identityType: "",
    identityNumber: "",
    course: "",
    occupation: "",
    occupationOther: "",
    studiedKoreanBefore: "",
    classMode: "Physical",
    email: "",
    phone: "",
    address: "",
    profilePicture: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ States
  const [admissionId, setAdmissionId] = useState(null);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ✅ State for showing installments on voucher
  const [showInstallments, setShowInstallments] = useState(false);

  const courseFees = {
    "EPS TOPIK": 25000,
    "TOPIK 1": 15000,
    "Basic Korean Language": 25000,
    "Fast-Track Korean (40 Days)": 20000,
    "Free Short Course": 1000,
  };

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date("2026-08-04");
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setFormData((prev) => ({
        ...prev,
        age: calculatedAge >= 0 ? calculatedAge : "",
      }));
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errorMessage) setErrorMessage("");
  };

  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5 && value.length <= 12) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
    }
    setFormData({ ...formData, identityNumber: value });
    if (errorMessage) setErrorMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        setErrorMessage(
          "Invalid file format! Please upload a JPG or JPEG image.",
        );
        e.target.value = "";
        return;
      }
      const maxSizeInBytes = 150 * 1024;
      if (file.size > maxSizeInBytes) {
        setErrorMessage(
          "File size is too large! Please upload a photo up to 150 KB.",
        );
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, profilePicture: file });
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    for (const key in formData) {
      if (key !== "profilePicture") {
        submitData.append(key, formData[key]);
      }
    }
    submitData.append("profilePicture", formData.profilePicture);

    try {
      const response = await fetch(`${API_URL}/api/admissions`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        setAdmissionId(result.admissionId);
        setShowSuccessPopup(true);
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        "❌ Could not connect to the server. Is the backend running?",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!admissionId) {
      alert("Admission ID not found. Please submit the form again.");
      return;
    }

    setReceiptUploading(true);
    const receiptData = new FormData();
    receiptData.append("feeReceipt", file);

    try {
      const response = await fetch(
        `${API_URL}/api/admissions/${admissionId}/receipt`,
        {
          method: "POST",
          body: receiptData,
        },
      );

      const result = await response.json();
      if (response.ok) {
        setReceiptSuccess(true);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload receipt. Check connection.");
    } finally {
      setReceiptUploading(false);
    }
  };

  const downloadVoucher = () => {
    const element = document.getElementById("fee-voucher");
    const opt = {
      margin: 0.5,
      filename: `${formData.name}_Fee_Voucher.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const selectedCourseFee = courseFees[formData.course] || 0;

  // ==========================================
  // ✅ 1. VOUCHER SCREEN (AFTER SUBMISSION)
  // ==========================================
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto my-28 p-8 flex flex-col items-center"
      >
        <div
          id="fee-voucher"
          className="bg-white text-black p-8 rounded-lg w-full border-t-8 border-red-600 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b-2 pb-4 mb-6 border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-red-600">HK Institute</h1>
              <p className="text-gray-500 font-medium">Admission Fee Voucher</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Valid for 7 days</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2 rounded">
              Applicant Details
            </h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <p>
                <span className="font-semibold text-gray-600">Name:</span>{" "}
                {formData.name}
              </p>
              <p>
                <span className="font-semibold text-gray-600">
                  Father's Name:
                </span>{" "}
                {formData.fatherName}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Phone:</span>{" "}
                {formData.phone}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Course:</span>{" "}
                {formData.course}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Mode:</span>{" "}
                {formData.classMode}
              </p>
            </div>
          </div>

          {/* ✅ VOUCHER FEE DETAILS & INSTALLMENT REVEAL */}
          <div className="mb-6 border-2 border-gray-100 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center text-lg">
              <p className="font-bold text-gray-700">Total Course Fee:</p>
              <p className="font-bold text-2xl text-red-600">
                PKR {selectedCourseFee.toLocaleString()}
              </p>
            </div>

            {/* Installment Plan Logic */}
            {selectedCourseFee > 15000 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {!showInstallments ? (
                  <button
                    onClick={() => setShowInstallments(true)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 underline transition-colors flex items-center gap-2"
                  >
                    💡 Installments also available. Click to view plan.
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mt-2"
                  >
                    <h4 className="font-bold text-blue-900 mb-2">
                      Installment Plan Breakdown
                    </h4>
                    <div className="flex justify-between text-sm text-blue-800 border-b border-blue-200 pb-2 mb-2">
                      <span>1st Installment (Pay Now for Admission):</span>
                      <span className="font-bold">PKR 15,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-800">
                      <span>2nd Installment (Next Month):</span>
                      <span className="font-bold">
                        PKR {(selectedCourseFee - 15000).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-blue-900">
            <h3 className="font-bold mb-2">Payment Instructions</h3>
            <p className="text-sm mb-3">
              Please transfer the exact fee amount to the following bank account
              and save the receipt.
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Bank Name:</span> Meezan Bank
              </p>
              <p>
                <span className="font-semibold">Account Title:</span> Hammad
                Ahmed
              </p>
              <p className="text-lg mt-1">
                <span className="font-semibold">Account Number:</span>{" "}
                <span className="font-bold tracking-widest text-black">
                  02760111079336
                </span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            This is a computer-generated voucher and does not require a
            signature.
          </p>
        </div>

        {receiptSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg font-bold text-center w-full shadow-sm"
          >
            ✅ Receipt Uploaded Successfully! Your admission is pending
            verification.
          </motion.div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <button
              onClick={downloadVoucher}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              📄 Download Voucher
            </button>

            <label
              className={`px-6 py-3 ${receiptUploading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 cursor-pointer"} text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2`}
            >
              {receiptUploading
                ? "📤 Uploading..."
                : "📤 Upload Payment Receipt"}
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
                disabled={receiptUploading}
              />
            </label>
          </div>
        )}
      </motion.div>
    );
  }

  // ==========================================
  // ✅ 2. MAIN ADMISSION FORM (BEFORE SUBMIT)
  // ==========================================
  return (
    <>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111c34] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 dark:border-white/10"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-3">
              Application Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              Your admission application has been successfully received.
              <br />
              <br />
              <strong className="text-red-600 dark:text-red-400">
                To confirm your admission, please upload your course fee or
                first installment voucher.
              </strong>
            </p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                setIsSubmitted(true);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg"
            >
              Proceed to Fee Submission
            </button>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto my-28 p-8 bg-white dark:bg-[#111c34] text-navy dark:text-white rounded-3xl shadow-2xl border border-gray-100 dark:border-white/15 transition-colors"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-500 dark:to-red-400">
            Admission Application
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Join HK Institute and start your Korean journey today.
          </p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-500/10 border-l-4 border-red-600 text-red-700 dark:text-red-400 font-semibold rounded-r-lg shadow-sm flex items-center justify-between"
          >
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 hover:text-red-700 font-bold px-2"
            >
              ✕
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/20 flex items-center justify-center shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">
                  No Image
                  <br />
                  Selected
                </span>
              )}
            </div>
            <div className="text-center">
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition text-sm shadow-sm border border-gray-300 dark:border-white/20 flex flex-col items-center">
                <span>Upload Passport Photo</span>
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
                  JPG/JPEG only, Max 150KB
                </span>
                <input
                  type="file"
                  name="profilePicture"
                  accept=".jpg, .jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
                placeholder="e.g. Ali Khan"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  required
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={formData.age}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-inner bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-bold p-3 text-center cursor-not-allowed outline-none"
                  placeholder="--"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              >
                <option value="" className="dark:bg-[#111c34]">
                  Select Gender...
                </option>
                <option value="Male" className="dark:bg-[#111c34]">
                  Male
                </option>
                <option value="Female" className="dark:bg-[#111c34]">
                  Female
                </option>
                <option value="Other" className="dark:bg-[#111c34]">
                  Other
                </option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-300 dark:border-white/20">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Identity Document
              </label>
              <div className="flex gap-6 mb-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="identityType"
                    value="CNIC"
                    checked={formData.identityType === "CNIC"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    CNIC
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="identityType"
                    value="Passport"
                    checked={formData.identityType === "Passport"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    Passport
                  </span>
                </label>
              </div>
              {formData.identityType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Enter {formData.identityType} Number
                  </label>
                  <input
                    type="text"
                    name="identityNumber"
                    value={formData.identityNumber}
                    required
                    onChange={
                      formData.identityType === "CNIC"
                        ? handleCnicChange
                        : handleChange
                    }
                    maxLength={formData.identityType === "CNIC" ? 15 : 20}
                    className="w-full md:w-1/2 rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-white dark:bg-black/30 text-gray-900 dark:text-white outline-none"
                    placeholder={
                      formData.identityType === "CNIC"
                        ? "XXXXX-XXXXXXX-X"
                        : "Enter Passport Number"
                    }
                  />
                </motion.div>
              )}
            </div>

            {/* ✅ Course Dropdown (Removed Fee Display here) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Course to Apply
              </label>
              <select
                name="course"
                value={formData.course}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              >
                <option value="" className="dark:bg-[#111c34]">
                  Select a Course...
                </option>
                <option value="EPS TOPIK" className="dark:bg-[#111c34]">
                  EPS TOPIK
                </option>
                <option value="TOPIK 1" className="dark:bg-[#111c34]">
                  TOPIK 1
                </option>
                <option
                  value="Basic Korean Language"
                  className="dark:bg-[#111c34]"
                >
                  Basic Korean Language
                </option>
                <option
                  value="Fast-Track Korean (40 Days)"
                  className="dark:bg-[#111c34]"
                >
                  Fast-Track Korean (40 Days)
                </option>
                <option value="Free Short Course" className="dark:bg-[#111c34]">
                  Free Short Course
                </option>
                <option
                  value="TOPIK 2"
                  disabled
                  className="text-gray-400 bg-gray-100 dark:bg-white/5 italic"
                >
                  TOPIK 2 (Currently Unavailable)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Occupation
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
              >
                <option value="" className="dark:bg-[#111c34]">
                  Select Occupation...
                </option>
                <option value="Student" className="dark:bg-[#111c34]">
                  Student
                </option>
                <option value="Job Holder" className="dark:bg-[#111c34]">
                  Job Holder
                </option>
                <option value="Businessman" className="dark:bg-[#111c34]">
                  Businessman
                </option>
                <option value="Other" className="dark:bg-[#111c34]">
                  Other
                </option>
              </select>
            </div>

            {formData.occupation === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="col-span-1 md:col-span-2"
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Please describe your occupation
                </label>
                <input
                  type="text"
                  name="occupationOther"
                  value={formData.occupationOther}
                  required={formData.occupation === "Other"}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-red-300 dark:border-red-500/30 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-red-50 dark:bg-red-500/10 text-gray-900 dark:text-white outline-none"
                  placeholder="E.g. Freelancer, Artist..."
                />
              </motion.div>
            )}

            <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-300 dark:border-white/20">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Have you studied Korean before?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="studiedKoreanBefore"
                    value="Yes"
                    checked={formData.studiedKoreanBefore === "Yes"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    Yes
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="studiedKoreanBefore"
                    value="No"
                    checked={formData.studiedKoreanBefore === "No"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    No
                  </span>
                </label>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-300 dark:border-white/20">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                How would you like to take class?
              </label>
              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="classMode"
                    value="Physical"
                    checked={formData.classMode === "Physical"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    Physical (On-Campus)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="classMode"
                    value="Online"
                    checked={formData.classMode === "Online"}
                    required
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-400 focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    Online
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Residential Address
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-white/20 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white outline-none"
            ></textarea>
          </div>

          <div className="text-center pt-6 pb-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-12 py-4 text-white font-bold rounded-full shadow-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-xl hover:scale-105"
              }`}
            >
              {isSubmitting
                ? "Submitting Application..."
                : "Submit Application"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

export default Admission;
