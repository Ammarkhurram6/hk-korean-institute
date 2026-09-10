export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getPhotoUrl = (profilePicture, name) => {
  if (!profilePicture) {
    // Fallback avatar agar photo mojood na ho
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Student",
    )}&background=CD2E3A&color=fff&bold=true&size=256`;
  }

  // Agar already full URL ho (jaise Cloudinary ya http se shuru ho)
  if (profilePicture.startsWith("http")) {
    return profilePicture;
  }

  // Relative path ke sath Render backend URL (`API_URL`) attach karna
  const cleanPath = profilePicture.startsWith("/")
    ? profilePicture
    : `/${profilePicture}`;

  return `${API_URL}${cleanPath}`;
};

export const getTotalPaid = (student) =>
  (student?.payments || []).reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );

export const getRemainingFee = (student) =>
  Math.max(0, (Number(student?.totalFee) || 0) - getTotalPaid(student));

export const getFeeStatus = (student) => {
  const totalPaid = getTotalPaid(student);
  const total = Number(student?.totalFee) || 0;
  if (total <= 0) return totalPaid > 0 ? "Paid" : "Unpaid";
  if (totalPaid >= total) return "Paid";
  if (totalPaid > 0) return "Partially Paid";
  return "Unpaid";
};

export const formatPKR = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;

export const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const toDateInput = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

export const DURATION_OPTIONS = [
  "1 Month",
  "40 Days",
  "3 Months",
  "6 Months",
  "1 Year",
];

export const DURATION_DAYS = {
  "1 Month": 30,
  "40 Days": 40,
  "2 Months": 60,
  "3 Months": 90,
  "6 Months": 180,
  "1 Year": 365,
};

export const calculateLastDay = (joiningDate, duration) => {
  if (!joiningDate || !duration || duration === "Custom") return null;
  const days = DURATION_DAYS[duration];
  if (!days) return null;
  const d = new Date(joiningDate);
  if (isNaN(d)) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
// Compact format: 15000 -> PKR 15K, 1500000 -> PKR 1.5M
export const formatPKRCompact = (n) => {
  const num = Number(n || 0);
  if (num >= 1000000) {
    const v = num / 1000000;
    return `PKR ${v % 1 === 0 ? v : v.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const v = num / 1000;
    return `PKR ${v % 1 === 0 ? v : v.toFixed(1)}K`;
  }
  return `PKR ${num.toLocaleString("en-PK")}`;
};

// Course Fee Structure (PKR)
export const COURSE_FEES = {
  "EPS TOPIK": 25000,
  "TOPIK 1": 15000,
  "Basic Korean Language": 25000,
  "Fast-Track Korean (40 Days)": 20000,
};

// Course name se fee nikalne ka helper (fuzzy match bhi karta hai)
export const getCourseFee = (courseName) => {
  if (!courseName) return 0;
  if (COURSE_FEES[courseName] !== undefined) return COURSE_FEES[courseName];
  // Case/space differences handle karne ke liye
  const normalized = String(courseName).toLowerCase().trim();
  const found = Object.keys(COURSE_FEES).find(
    (key) => key.toLowerCase().trim() === normalized,
  );
  return found ? COURSE_FEES[found] : 0;
};
export const STATUS_OPTIONS = ["Active", "Completed", "Dropped", "On Hold"];
