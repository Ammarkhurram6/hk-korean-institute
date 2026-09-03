import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiUsers,
  FiMail,
  FiBookOpen,
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Admin() {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New State for Search, Filter, and Expansion
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = { Authorization: `Bearer ${token}` };

      const [admissionsResponse, contactsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/admissions`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers }),
      ]);

      if (
        admissionsResponse.status === 401 ||
        contactsResponse.status === 401
      ) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const admissionsData = await admissionsResponse.json();
      const contactsData = await contactsResponse.json();

      if (!admissionsData.success)
        throw new Error(admissionsData.error || "Failed to load admissions.");
      if (!contactsData.success)
        throw new Error(contactsData.error || "Failed to load contacts.");

      setAdmissions(admissionsData.admissions || []);
      setContacts(contactsData.contacts || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Handle Status Change Locally (UI Update)
  // Handle Status Change (Database Update)
  const handleStatusChange = async (id, newStatus) => {
    // 1. Pehle UI par update kar dein taake user ko turant dikhe
    setAdmissions((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item,
      ),
    );

    // 2. Ab Backend API ko call karein taake database mein save ho jaye
    try {
      const response = await fetch(`${API_URL}/api/admin/admissions/${id}`, {
        method: "PATCH", // ya "PUT"
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update status in database");
      }

      console.log("Status updated successfully in DB!");
    } catch (error) {
      console.error(error);
      alert("Failed to update status. Reverting back.");
      // Agar fail ho jaye, toh purana data wapas fetch kar lein
      fetchAdminData();
    }
  };

  // Filter Logic
  const filteredAdmissions = admissions.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      courseFilter === "All" || item.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // Get unique courses for dropdown
  const courses = [
    "All",
    ...new Set(admissions.map((item) => item.course).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray dark:bg-charcoal text-navy dark:text-white">
        <FiLoader className="animate-spin text-5xl text-kred mb-4" />
        <p className="text-xl font-display font-semibold tracking-wide">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  // Helper to render status badges
  const renderStatusBadge = (status) => {
    const base =
      "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5";
    switch (status) {
      case "Accepted":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            <FiCheckCircle /> Accepted
          </span>
        );
      case "Reviewed":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            <FiEye /> Reviewed
          </span>
        );
      case "Rejected":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            <FiXCircle /> Rejected
          </span>
        );
      default:
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            <FiClock /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-lightgray dark:bg-charcoal transition-colors">
      {/* Premium Header */}
      <header className="bg-white dark:bg-navy shadow-sm border-b border-gray-100 dark:border-white/10 sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-navy/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kred text-white flex items-center justify-center font-display font-bold shadow-md">
              HK
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy dark:text-white leading-none">
                HK Korean Institute
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Admin Control Panel
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-kred/10 text-kred hover:bg-kred hover:text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm"
          >
            <FiLogOut /> Logout
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <motion.div className="mb-8 flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-3">
            <FiAlertCircle className="text-xl" />
            {error}
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm p-6 flex items-center gap-6 border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-kred/10 flex items-center justify-center text-kred text-2xl">
              <FiUsers />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Total Admissions
              </p>
              <h2 className="text-4xl font-bold text-navy dark:text-white mt-1">
                {admissions.length}
              </h2>
            </div>
          </div>

          <div className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm p-6 flex items-center gap-6 border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl">
              <FiClock />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Pending Reviews
              </p>
              <h2 className="text-4xl font-bold text-navy dark:text-white mt-1">
                {
                  admissions.filter((a) => !a.status || a.status === "Pending")
                    .length
                }
              </h2>
            </div>
          </div>

          <div className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm p-6 flex items-center gap-6 border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl">
              <FiMail />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Contact Messages
              </p>
              <h2 className="text-4xl font-bold text-navy dark:text-white mt-1">
                {contacts.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Admissions Section */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm mb-10 overflow-hidden border border-gray-100 dark:border-white/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiBookOpen className="text-kred text-xl" />
              <h2 className="text-xl font-bold text-navy dark:text-white">
                Admission Applications
              </h2>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-navy dark:text-white outline-none focus:ring-2 focus:ring-kred transition-all"
                />
              </div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-navy dark:text-white outline-none focus:ring-2 focus:ring-kred transition-all cursor-pointer"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAdmissions.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No matching admission applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Applicant Info</th>
                    <th className="px-6 py-4 font-medium">Course</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredAdmissions.map((admission) => (
                    <>
                      <tr
                        key={admission._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === admission._id
                              ? null
                              : admission._id,
                          )
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-navy/10 dark:bg-white/10 text-navy dark:text-white flex items-center justify-center font-bold text-sm">
                              {admission.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-navy dark:text-white">
                                {admission.name || "-"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {admission.email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-kred/10 text-kred rounded-full text-xs font-semibold">
                            {admission.course || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {renderStatusBadge(admission.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-navy dark:hover:text-white inline-flex items-center gap-1 text-sm font-medium">
                            {expandedRow === admission._id ? "Hide" : "View"}{" "}
                            <FiChevronDown
                              className={`transition-transform ${expandedRow === admission._id ? "rotate-180" : ""}`}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      <AnimatePresence>
                        {expandedRow === admission._id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50/50 dark:bg-white/[0.02]"
                          >
                            <td colSpan="4" className="px-6 py-6">
                              <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-400 mb-1">
                                        Phone Number
                                      </p>
                                      <p className="font-medium text-navy dark:text-white">
                                        {admission.phone || "Not provided"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400 mb-1">
                                        Gender
                                      </p>
                                      <p className="font-medium text-navy dark:text-white">
                                        {admission.gender || "Not specified"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400 mb-1">
                                        Application Date
                                      </p>
                                      <p className="font-medium text-navy dark:text-white">
                                        {admission.createdAt
                                          ? new Date(
                                              admission.createdAt,
                                            ).toLocaleDateString()
                                          : "Unknown"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Update Controls */}
                                <div className="flex flex-col gap-2 border-l border-gray-200 dark:border-white/10 pl-6">
                                  <p className="text-sm font-semibold text-navy dark:text-white mb-1">
                                    Update Status:
                                  </p>
                                  <select
                                    value={admission.status || "Pending"}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        admission._id,
                                        e.target.value,
                                      )
                                    }
                                    className="bg-white dark:bg-charcoal border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-navy dark:text-white outline-none focus:ring-2 focus:ring-kred"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        {/* Contacts Section */}
        <motion.section
          className="bg-white dark:bg-navy/20 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
            <FiMail className="text-blue-500 text-xl" />
            <h2 className="text-xl font-bold text-navy dark:text-white">
              Contact Messages
            </h2>
          </div>

          {contacts.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No contact messages yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {contacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-navy dark:text-white">
                      {contact.name}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {contact.email}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {contact.message}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    📞 <strong>Phone:</strong> {msg.phone}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}

export default Admin;
