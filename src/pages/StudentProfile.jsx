import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft, FiLoader, FiSave, FiPlus, FiTrash2, FiEdit2, FiX,
  FiCheckCircle, FiAlertCircle, FiDollarSign, FiBookOpen, FiUser, FiCalendar,
} from "react-icons/fi";
import {
  API_URL, getPhotoUrl, getFeeStatus, getTotalPaid, getRemainingFee,
  formatPKR, formatDate, toDateInput, DURATION_OPTIONS, calculateLastDay, STATUS_OPTIONS,
} from "../utils/studentHelpers";

const inputClass = "w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-navy dark:text-white outline-none focus:ring-2 focus:ring-kred transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [savingSection, setSavingSection] = useState("");

  const [statusDraft, setStatusDraft] = useState("Active");
  const [courseForm, setCourseForm] = useState({ course: "", courseDuration: "", customDuration: "", joiningDate: "", lastDay: "" });
  const [feeForm, setFeeForm] = useState({ totalFee: 0 });
  const [bookForm, setBookForm] = useState({ ordered: false, bookName: "", orderDate: "", purchaseDate: "", price: 0, paymentStatus: "Unpaid", details: "" });
  const [notesForm, setNotesForm] = useState("");

  const [paymentForm, setPaymentForm] = useState({ amount: "", date: "", details: "" });
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load student.");
      setStudent(data.student);
      populateDrafts(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const populateDrafts = (s) => {
    setStatusDraft(s.status || "Active");
    setCourseForm({
      course: s.course || "",
      courseDuration: s.courseDuration || "",
      customDuration: s.customDuration || "",
      joiningDate: toDateInput(s.joiningDate),
      lastDay: toDateInput(s.lastDay),
    });
    setFeeForm({ totalFee: s.totalFee || 0 });
    setBookForm({
      ordered: s.book?.ordered || false,
      bookName: s.book?.bookName || "",
      orderDate: toDateInput(s.book?.orderDate),
      purchaseDate: toDateInput(s.book?.purchaseDate),
      price: s.book?.price || 0,
      paymentStatus: s.book?.paymentStatus || "Unpaid",
      details: s.book?.details || "",
    });
    setNotesForm(s.notes || "");
  };

  const updateStudent = async (payload, section, successMsg) => {
    try {
      setSavingSection(section);
      const res = await fetch(`${API_URL}/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed.");
      setStudent(data.student);
      showToast("success", successMsg || data.message || "Saved successfully.");
      return true;
    } catch (err) {
      showToast("error", err.message);
      return false;
    } finally {
      setSavingSection("");
    }
  };

  const handleStatusChange = (val) => {
    setStatusDraft(val);
    updateStudent({ status: val }, "status", `Status changed to ${val}.`);
  };

  const handleDurationChange = (value) => {
    setCourseForm((prev) => {
      const next = { ...prev, courseDuration: value };
      if (value !== "Custom") next.customDuration = "";
      const last = calculateLastDay(prev.joiningDate, value);
      if (last) next.lastDay = last;
      return next;
    });
  };

  const handleJoiningChange = (value) => {
    setCourseForm((prev) => {
      const next = { ...prev, joiningDate: value };
      const last = calculateLastDay(value, prev.courseDuration);
      if (last) next.lastDay = last;
      return next;
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      showToast("error", "Please enter a valid amount.");
      return;
    }
    try {
      setSavingSection("payment");
      const url = editingPaymentId
        ? `${API_URL}/api/admin/students/${id}/payments/${editingPaymentId}`
        : `${API_URL}/api/admin/students/${id}/payments`;
      const res = await fetch(url, {
        method: editingPaymentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: Number(paymentForm.amount),
          date: paymentForm.date || new Date().toISOString().split("T")[0],
          details: paymentForm.details,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save payment.");
      setStudent(data.student);
      showToast("success", editingPaymentId ? "Payment updated." : "Payment added.");
      setPaymentForm({ amount: "", date: "", details: "" });
      setEditingPaymentId(null);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSavingSection("");
    }
  };

  const startEditPayment = (p) => {
    setEditingPaymentId(p._id);
    setPaymentForm({ amount: p.amount, date: toDateInput(p.date), details: p.details || "" });
  };

  const handleDeletePayment = async (p) => {
    if (!window.confirm(`Delete payment of ${formatPKR(p.amount)}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/students/${id}/payments/${p._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete payment.");
      setStudent(data.student);
      showToast("success", "Payment deleted.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleDeleteStudent = async () => {
    if (!window.confirm(`Delete student record for "${student.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete student.");
      navigate("/admin/students");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray dark:bg-charcoal text-navy dark:text-white">
        <FiLoader className="animate-spin text-5xl text-kred mb-4" />
        <p className="text-xl font-display font-semibold">Loading Student Profile...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray dark:bg-charcoal text-navy dark:text-white px-4">
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-xl font-semibold mb-4">{error || "Student not found."}</p>
        <Link to="/admin/students" className="btn-primary text-sm">Back to Student Records</Link>
      </div>
    );
  }

  const totalPaid = getTotalPaid(student);
  const remaining = getRemainingFee(student);
  const feeStatus = getFeeStatus(student);

  return (
    <div className="min-h-screen bg-lightgray dark:bg-charcoal transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-navy/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kred text-white flex items-center justify-center font-display font-bold shadow-md">HK</div>
            <div>
              <h1 className="text-lg font-bold text-navy dark:text-white leading-none">Student Profile</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">HK Korean Institute</p>
            </div>
          </div>
          <Link to="/admin/students" className="flex items-center gap-2 bg-navy/5 dark:bg-white/10 text-navy dark:text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-navy hover:text-white transition-all">
            <FiArrowLeft /> All Students
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <motion.div
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={getPhotoUrl(student.profilePicture, student.name)}
            alt={student.name}
            className="w-28 h-28 rounded-2xl object-cover shadow-md border-4 border-white dark:border-white/10"
          />
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">{student.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
              {student.course && <span className="px-3 py-1 bg-kred/10 text-kred rounded-full text-xs font-bold">{student.course}</span>}
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === "Active" ? "bg-green-100 text-green-700" : student.status === "Completed" ? "bg-blue-100 text-blue-700" : student.status === "Dropped" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                {student.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${feeStatus === "Paid" ? "bg-green-100 text-green-700" : feeStatus === "Partially Paid" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                {feeStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Admitted on: <span className="font-medium text-navy dark:text-white">{formatDate(student.admissionDate || student.createdAt)}</span>
              {"  •  "}Joined: <span className="font-medium text-navy dark:text-white">{formatDate(student.joiningDate)}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-48">
            <div>
              <label className={labelClass}>Update Status</label>
              <select value={statusDraft} onChange={(e) => handleStatusChange(e.target.value)} className={inputClass}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={handleDeleteStudent}
              className="flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <FiTrash2 /> Delete Student
            </button>
          </div>
        </motion.div>

        {/* Personal + Course Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Information */}
          <motion.section
            className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-navy/10 dark:bg-white/10 text-navy dark:text-white flex items-center justify-center"><FiUser /></div>
              <h3 className="text-xl font-bold text-navy dark:text-white">Personal Information</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {[
                ["Father Name", student.fatherName],
                ["Date of Birth", student.dob ? formatDate(student.dob) : "—"],
                ["Age", student.age || "—"],
                ["Gender", student.gender || "—"],
                ["Identity", student.identityNumber ? `${student.identityType || ""}: ${student.identityNumber}` : "—"],
                ["Email", student.email || "—"],
                ["Phone", student.phone || "—"],
                ["Occupation", student.occupation || "—"],
                ["Studied Korean Before", student.studiedKoreanBefore || "—"],
                ["Address", student.address || "—"],
              ].map(([label, value], i) => (
                <div key={i}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Course Information */}
          <motion.section
            className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><FiCalendar /></div>
              <h3 className="text-xl font-bold text-navy dark:text-white">Course Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Course</label>
                <input type="text" value={courseForm.course} onChange={(e) => setCourseForm((p) => ({ ...p, course: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Course Duration</label>
                <select value={courseForm.courseDuration} onChange={(e) => handleDurationChange(e.target.value)} className={inputClass}>
                  <option value="">Select Duration</option>
                  {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  <option value="Custom">Custom</option>
                </select>
              </div>
              {courseForm.courseDuration === "Custom" && (
                <div>
                  <label className={labelClass}>Custom Duration (e.g. 75 Days)</label>
                  <input type="text" value={courseForm.customDuration} onChange={(e) => setCourseForm((p) => ({ ...p, customDuration: e.target.value }))} className={inputClass} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Joining Date</label>
                  <input type="date" value={courseForm.joiningDate} onChange={(e) => handleJoiningChange(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Day</label>
                  <input type="date" value={courseForm.lastDay} onChange={(e) => setCourseForm((p) => ({ ...p, lastDay: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <p className="text-xs text-gray-400">Last Day auto-calculates from Duration + Joining Date, but you can change it manually.</p>
              <button
                onClick={() => updateStudent(courseForm, "course", "Course information saved.")}
                disabled={savingSection === "course"}
                className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {savingSection === "course" ? <FiLoader className="animate-spin" /> : <FiSave />} Save Course Info
              </button>
            </div>
          </motion.section>
        </div>

        {/* Fees & Payments */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-kred/10 text-kred flex items-center justify-center"><FiDollarSign /></div>
            <h3 className="text-xl font-bold text-navy dark:text-white">Fees & Payments</h3>
          </div>

          {/* Fee Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Fee</p>
              <input
                type="number"
                value={feeForm.totalFee}
                onChange={(e) => setFeeForm({ totalFee: e.target.value })}
                className="w-full bg-transparent text-lg font-bold text-navy dark:text-white outline-none border-b-2 border-gray-200 dark:border-white/10 focus:border-kred transition-all"
              />
              <button
                onClick={() => updateStudent({ totalFee: Number(feeForm.totalFee) }, "fee", "Total fee updated.")}
                disabled={savingSection === "fee"}
                className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-kred hover:underline"
              >
                {savingSection === "fee" ? <FiLoader className="animate-spin" /> : <FiSave size={12} />} Save Fee
              </button>
            </div>
            <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-xl font-bold text-green-600">{formatPKR(totalPaid)}</p>
              <p className="text-xs text-gray-400 mt-1">{student.payments?.length || 0} payment(s)</p>
            </div>
            <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Remaining Fee</p>
              <p className="text-xl font-bold text-red-500">{formatPKR(remaining)}</p>
              <p className="text-xs text-gray-400 mt-1">Calculated automatically</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-4 flex flex-col justify-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold w-fit ${feeStatus === "Paid" ? "bg-green-100 text-green-700" : feeStatus === "Partially Paid" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                {feeStatus}
              </span>
            </div>
          </div>

          {/* Payment History */}
          <h4 className="text-sm font-bold text-navy dark:text-white uppercase tracking-wider mb-3">Payment History</h4>
          {(!student.payments || student.payments.length === 0) ? (
            <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl mb-6 text-sm">
              No payments recorded yet. Add the first payment below.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5 mb-6">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Details</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {student.payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-green-600 whitespace-nowrap">{formatPKR(p.amount)}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(p.date)}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">{p.details || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEditPayment(p)} className="p-2 rounded-lg bg-navy/5 dark:bg-white/10 text-navy dark:text-white hover:bg-navy hover:text-white transition-all" title="Edit Payment">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => handleDeletePayment(p)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Delete Payment">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add / Edit Payment Form */}
          <form onSubmit={handlePaymentSubmit} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
              {editingPaymentId ? <><FiEdit2 /> Edit Payment</> : <><FiPlus /> Add Advance Payment</>}
            </h4>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Amount (PKR) *</label>
                <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} className={inputClass} placeholder="20000" required />
              </div>
              <div>
                <label className={labelClass}>Payment Date</label>
                <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm((p) => ({ ...p, date: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Details (optional)</label>
                <input type="text" value={paymentForm.details} onChange={(e) => setPaymentForm((p) => ({ ...p, details: e.target.value }))} className={inputClass} placeholder="e.g. Admission fee" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={savingSection === "payment"}
                className="flex items-center gap-2 bg-kred hover:bg-kred/90 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-kred/20 transition-all"
              >
                {savingSection === "payment" ? <FiLoader className="animate-spin" /> : editingPaymentId ? <><FiSave /> Update Payment</> : <><FiPlus /> Add Payment</>}
              </button>
              {editingPaymentId && (
                <button
                  type="button"
                  onClick={() => { setEditingPaymentId(null); setPaymentForm({ amount: "", date: "", details: "" }); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                  <FiX /> Cancel
                </button>
              )}
            </div>
          </form>
        </motion.section>

        {/* Book Information */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><FiBookOpen /></div>
            <h3 className="text-xl font-bold text-navy dark:text-white">Book Information</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelClass}>Book Ordered?</label>
              <select
                value={bookForm.ordered ? "Yes" : "No"}
                onChange={(e) => setBookForm((p) => ({ ...p, ordered: e.target.value === "Yes" }))}
                className={inputClass}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {bookForm.ordered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-5"
            >
              <div>
                <label className={labelClass}>Book Name</label>
                <input type="text" value={bookForm.bookName} onChange={(e) => setBookForm((p) => ({ ...p, bookName: e.target.value }))} className={inputClass} placeholder="EPS TOPIK Korean Book" />
              </div>
              <div>
                <label className={labelClass}>Book Price (PKR)</label>
                <input type="number" value={bookForm.price} onChange={(e) => setBookForm((p) => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="5000" />
              </div>
              <div>
                <label className={labelClass}>Order Date</label>
                <input type="date" value={bookForm.orderDate} onChange={(e) => setBookForm((p) => ({ ...p, orderDate: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Purchase Date</label>
                <input type="date" value={bookForm.purchaseDate} onChange={(e) => setBookForm((p) => ({ ...p, purchaseDate: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Book Payment Status</label>
                <select value={bookForm.paymentStatus} onChange={(e) => setBookForm((p) => ({ ...p, paymentStatus: e.target.value }))} className={inputClass}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Details / Notes</label>
                <textarea rows="3" value={bookForm.details} onChange={(e) => setBookForm((p) => ({ ...p, details: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Student purchased the complete EPS TOPIK preparation book set." />
              </div>
            </motion.div>
          )}

          <button
            onClick={() =>
              updateStudent(
                { book: { ...bookForm, price: Number(bookForm.price), orderDate: bookForm.orderDate || null, purchaseDate: bookForm.purchaseDate || null } },
                "book",
                "Book information saved."
              )
            }
            disabled={savingSection === "book"}
            className="mt-5 flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {savingSection === "book" ? <FiLoader className="animate-spin" /> : <FiSave />} Save Book Info
          </button>
        </motion.section>

        {/* Notes */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-navy dark:text-white mb-4">Notes / Details</h3>
          <textarea
            rows="4"
            value={notesForm}
            onChange={(e) => setNotesForm(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Any additional notes about this student..."
          />
          <button
            onClick={() => updateStudent({ notes: notesForm }, "notes", "Notes saved.")}
            disabled={savingSection === "notes"}
            className="mt-4 flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {savingSection === "notes" ? <FiLoader className="animate-spin" /> : <FiSave />} Save Notes
          </button>
        </motion.section>
      </main>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-medium text-sm ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.type === "success" ? <FiCheckCircle className="text-lg" /> : <FiAlertCircle className="text-lg" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentProfile;