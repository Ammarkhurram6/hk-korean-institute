import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiX,
  FiLoader,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import {
  API_URL,
  getPhotoUrl,
  getFeeStatus,
  getRemainingFee,
  formatPKR,
  formatPKRCompact,
  DURATION_OPTIONS,
  calculateLastDay,
  STATUS_OPTIONS,
  COURSE_FEES,
  getCourseFee,
} from "../utils/studentHelpers";

const inputClass =
  "w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-navy dark:text-white outline-none focus:ring-2 focus:ring-kred transition-all";

const statusBadge = (status) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Dropped: "bg-red-100 text-red-700",
    "On Hold": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status || "Active"}
    </span>
  );
};

const feeBadge = (status) => {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    "Partially Paid": "bg-yellow-100 text-yellow-700",
    Unpaid: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status]}`}
    >
      {status}
    </span>
  );
};

function Students() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);

  // Banking-app style fee privacy toggle (default hidden)
  const [showFees, setShowFees] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to load students.");
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student) => {
    if (
      !window.confirm(
        `Delete student record for "${student.name}"? This cannot be undone.`,
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/api/admin/students/${student._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to delete student.");
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q) ||
      s.course?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesCourse = courseFilter === "All" || s.course === courseFilter;
    const matchesFee = feeFilter === "All" || getFeeStatus(s) === feeFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesFee;
  });

  const courses = [...new Set(students.map((s) => s.course).filter(Boolean))];

  const activeCount = students.filter((s) => s.status === "Active").length;
  const completedCount = students.filter(
    (s) => s.status === "Completed",
  ).length;
  const pendingFeesCount = students.filter(
    (s) => getFeeStatus(s) !== "Paid",
  ).length;
  const totalOutstanding = students.reduce(
    (sum, s) => sum + getRemainingFee(s),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray dark:bg-charcoal text-navy dark:text-white">
        <FiLoader className="animate-spin text-5xl text-kred mb-4" />
        <p className="text-xl font-display font-semibold">
          Loading Student Records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightgray dark:bg-charcoal transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-navy/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kred text-white flex items-center justify-center font-display font-bold shadow-md">
              HK
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy dark:text-white leading-none">
                Student Records
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                HK Korean Institute
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 bg-navy/5 dark:bg-white/10 text-navy dark:text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-navy hover:text-white transition-all"
          >
            <FiArrowLeft /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-8 flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-3">
            <FiAlertCircle className="text-xl" /> {error}
          </div>
        )}

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            {
              icon: <FiUsers />,
              label: "Total Students",
              value: students.length,
              color: "bg-navy/10 text-navy dark:text-white",
              eye: false,
            },
            {
              icon: <FiUserCheck />,
              label: "Active",
              value: activeCount,
              color: "bg-green-100 text-green-600",
              eye: false,
            },
            {
              icon: <FiUserCheck />,
              label: "Completed",
              value: completedCount,
              color: "bg-blue-100 text-blue-600",
              eye: false,
            },
            {
              icon: <FiClock />,
              label: "Pending Fees",
              value: pendingFeesCount,
              color: "bg-yellow-100 text-yellow-600",
              eye: false,
            },
            {
              icon: <FiDollarSign />,
              label: "Outstanding",
              value: showFees
                ? formatPKRCompact(totalOutstanding)
                : "PKR *****",
              color: "bg-kred/10 text-kred",
              eye: true,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm p-5 border border-gray-100 dark:border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center text-lg`}
                >
                  {card.icon}
                </div>
                {card.eye && (
                  <button
                    onClick={() => setShowFees((prev) => !prev)}
                    className="text-gray-400 hover:text-kred transition-colors p-1"
                    title={showFees ? "Hide fee" : "Show fee"}
                  >
                    {showFees ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                {card.label}
              </p>
              <h2 className="text-2xl font-bold text-navy dark:text-white mt-1">
                {card.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-5 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputClass} pl-11`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputClass} md:w-36 cursor-pointer`}
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className={`${inputClass} md:w-40 cursor-pointer`}
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className={`${inputClass} md:w-40 cursor-pointer`}
          >
            <option value="All">All Fees</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-kred hover:bg-kred/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-kred/20 transition-all whitespace-nowrap"
          >
            <FiPlus /> Add Student
          </button>
        </div>

        {/* Students Table */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FiUsers className="text-5xl mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No student records found.</p>
              <p className="text-sm mt-1">
                Accept an admission or click "Add Student" to create one
                manually.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 font-medium">Student</th>
                    <th className="px-3 sm:px-4 py-3 font-medium">Phone</th>
                    <th className="px-3 sm:px-4 py-3 font-medium">Course</th>
                    <th className="px-3 sm:px-4 py-3 font-medium">Duration</th>
                    <th className="px-3 sm:px-4 py-3 font-medium">
                      Fee Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 font-medium">Remaining</th>
                    <th className="px-3 sm:px-4 py-3 font-medium">Status</th>
                    <th className="px-3 sm:px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filtered.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPhotoUrl(
                              student.profilePicture,
                              student.name,
                            )}
                            alt={student.name}
                            className="w-9 h-9 rounded-full object-cover shadow-sm flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-navy dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.email || student.phone || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {student.phone || "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-kred/10 text-kred rounded-full text-xs font-semibold">
                          {student.course || "—"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {student.courseDuration === "Custom"
                          ? student.customDuration || "Custom"
                          : student.courseDuration || "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        {feeBadge(getFeeStatus(student))}
                      </td>
                      <td className="px-3 sm:px-4 py-3 font-semibold text-navy dark:text-white whitespace-nowrap">
                        {formatPKRCompact(getRemainingFee(student))}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        {statusBadge(student.status)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/students/${student._id}`}
                            className="p-2 rounded-lg bg-navy/5 dark:bg-white/10 text-navy dark:text-white hover:bg-navy hover:text-white transition-all"
                            title="View Profile"
                          >
                            <FiEye />
                          </Link>
                          <button
                            onClick={() => handleDelete(student)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Delete Student"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onCreated={(student) => {
            setStudents((prev) => [student, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

/* ================= ADD STUDENT MODAL ================= */
function AddStudentModal({ onClose, onCreated }) {
  const token = localStorage.getItem("adminToken");

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    identityType: "CNIC",
    identityNumber: "",
    email: "",
    phone: "",
    address: "",
    course: "",
    occupation: "",
    studiedKoreanBefore: "No",
    courseDuration: "",
    customDuration: "",
    joiningDate: "",
    lastDay: "",
    totalFee: "",
    status: "Active",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDurationChange = (value) => {
    setForm((prev) => {
      const next = { ...prev, courseDuration: value };
      if (value !== "Custom") next.customDuration = "";
      const last = calculateLastDay(prev.joiningDate, value);
      if (last) next.lastDay = last;
      return next;
    });
  };

  const handleJoiningChange = (value) => {
    setForm((prev) => {
      const next = { ...prev, joiningDate: value };
      const last = calculateLastDay(value, prev.courseDuration);
      if (last) next.lastDay = last;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim()) {
      setErr("Student name is required.");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      if (file) fd.append("profilePicture", file);

      const res = await fetch(`${API_URL}/api/admin/students`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to create student.");
      onCreated(data.student);
    } catch (error) {
      setErr(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  const [customCourse, setCustomCourse] = useState(false);

  const handleCourseChange = (val) => {
    if (val === "__custom__") {
      setCustomCourse(true);
      return;
    }
    setCustomCourse(false);
    setForm((prev) => {
      const next = { ...prev, course: val };
      const fee = getCourseFee(val);
      if (fee > 0) next.totalFee = String(fee); // Total Fee bhi auto-fill
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        className="bg-white dark:bg-charcoal rounded-3xl shadow-2xl w-full max-w-3xl my-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-xl font-bold text-navy dark:text-white">
            Add New Student
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-kred text-2xl"
          >
            <FiX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
        >
          {err && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
              <FiAlertCircle /> {err}
            </div>
          )}

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Personal Information
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Muhammad Ammar"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Father Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className={`${inputClass} py-2`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Identity Type
              </label>
              <select
                name="identityType"
                value={form.identityType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="CNIC">CNIC</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Identity Number
              </label>
              <input
                type="text"
                name="identityNumber"
                value={form.identityNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
            Course Information
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Course
              </label>
              <select
                value={customCourse ? "__custom__" : form.course}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Course</option>
                {Object.entries(COURSE_FEES).map(([name, fee]) => (
                  <option key={name} value={name}>
                    {name} — PKR {fee.toLocaleString("en-PK")}
                  </option>
                ))}
                <option value="__custom__">Other (Manual Entry)</option>
              </select>
              {customCourse && (
                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className={`${inputClass} mt-2`}
                  placeholder="Custom course name likhein"
                />
              )}
              {getCourseFee(form.course) > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1.5">
                  ✓ Fee auto-filled: {formatPKR(getCourseFee(form.course))}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Studied Korean Before?
              </label>
              <select
                name="studiedKoreanBefore"
                value={form.studiedKoreanBefore}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Course Duration
              </label>
              <select
                value={form.courseDuration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Duration</option>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Custom">Custom</option>
              </select>
            </div>
            {form.courseDuration === "Custom" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Custom Duration
                </label>
                <input
                  type="text"
                  name="customDuration"
                  value={form.customDuration}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 75 Days"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Joining Date
              </label>
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) => handleJoiningChange(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Last Day
              </label>
              <input
                type="date"
                value={form.lastDay}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastDay: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Total Fee (PKR)
              </label>
              <input
                type="number"
                name="totalFee"
                value={form.totalFee}
                onChange={handleChange}
                className={inputClass}
                placeholder="60000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-kred hover:bg-kred/90 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-kred/20 transition-all"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <FiPlus /> Create Student
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Students;
