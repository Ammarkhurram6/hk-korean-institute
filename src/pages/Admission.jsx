import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    email: "",
    phone: "",
    address: "",
    profilePicture: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // 🔴 Red Warning State

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
    if (errorMessage) setErrorMessage(""); // Clear warning when user types
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

      const maxSizeInBytes = 50 * 1024; // 50 KB
      if (file.size > maxSizeInBytes) {
        setErrorMessage(
          "File size is too large! Please upload a photo up to 50 KB.",
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

    const submitData = new FormData();
    for (const key in formData) {
      if (key !== "profilePicture") {
        submitData.append(key, formData[key]);
      }
    }
    submitData.append("profilePicture", formData.profilePicture);

    try {
      // 🔄 Sirf yahan localhost ki jagah ${API_URL} laga diya hai
      const response = await fetch(`${API_URL}/api/admissions`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("🎉 Application Submitted Successfully!");

        // 👉 Yeh form clear wala code bilkul safe hai, kahin nahi ja raha!
        setFormData({
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
          email: "",
          phone: "",
          address: "",
          profilePicture: null,
        });
        setImagePreview(null);
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        "❌ Could not connect to the server. Is the backend running?",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
          Admission Application
        </h2>
        <p className="text-gray-500 mt-2">
          Join HK Institute and start your Korean journey today.
        </p>
      </div>

      {/* 🔴 Red Warning Banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 font-semibold rounded-r-lg shadow-sm flex items-center justify-between"
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
        {/* 📸 Profile Picture */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 flex items-center justify-center shadow-inner">
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
            <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition text-sm shadow-sm border border-gray-300 flex flex-col items-center">
              <span>Upload Passport Photo</span>
              <span className="text-xs text-red-600 font-semibold mt-1">
                JPG/JPEG only, Max 50KB
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

        {/* 📝 Main Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
              placeholder="e.g. Ali Khan"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            />
          </div>

          {/* Date of Birth & Auto Age */}
          <div className="flex gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Age
              </label>
              <input
                type="text"
                value={formData.age}
                readOnly
                className="w-full rounded-lg border border-gray-300 shadow-inner bg-gray-200 text-gray-900 font-bold p-3 text-center cursor-not-allowed outline-none"
                placeholder="--"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            >
              <option value="">Select Gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 🆔 Identity Document */}
          <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-300">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                <span className="ml-2 text-gray-900 font-medium">CNIC</span>
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
                <span className="ml-2 text-gray-900 font-medium">Passport</span>
              </label>
            </div>

            {formData.identityType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                  className="w-full md:w-1/2 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-white text-gray-900 outline-none"
                  placeholder={
                    formData.identityType === "CNIC"
                      ? "XXXXX-XXXXXXX-X"
                      : "Enter Passport Number"
                  }
                />
              </motion.div>
            )}
          </div>

          {/* 🎓 Course Selection */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Course to Apply
            </label>
            <select
              name="course"
              value={formData.course}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            >
              <option value="">Select a Course...</option>
              <option value="EPS TOPIK">EPS TOPIK</option>
              <option value="TOPIK 1">TOPIK 1</option>
              <option value="Basic Korean Language">
                Basic Korean Language
              </option>
              <option
                value="TOPIK 2"
                disabled
                className="text-gray-400 bg-gray-100 italic"
              >
                TOPIK 2 (Currently Unavailable)
              </option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            />
          </div>

          {/* Occupation */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Occupation
            </label>
            <select
              name="occupation"
              value={formData.occupation}
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
            >
              <option value="">Select Occupation...</option>
              <option value="Student">Student</option>
              <option value="Job Holder">Job Holder</option>
              <option value="Businessman">Businessman</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Conditional "Other" */}
          {formData.occupation === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="col-span-1 md:col-span-2"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Please describe your occupation
              </label>
              <input
                type="text"
                name="occupationOther"
                value={formData.occupationOther}
                required={formData.occupation === "Other"}
                onChange={handleChange}
                className="w-full rounded-lg border border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-red-50 text-gray-900 outline-none"
                placeholder="E.g. Freelancer, Artist..."
              />
            </motion.div>
          )}

          {/* Previous Korean Study */}
          <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-300">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                <span className="ml-2 text-gray-900 font-medium">Yes</span>
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
                <span className="ml-2 text-gray-900 font-medium">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Residential Address
          </label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            required
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-3 bg-gray-50 text-gray-900 outline-none"
          ></textarea>
        </div>

        <div className="text-center pt-6 pb-2">
          <button
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Submit Application
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default Admission;
