export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getPhotoUrl = (pic, name = "S") => {
  if (!pic) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=CD2E3A&color=fff&bold=true&size=256`;
  }
  if (pic.startsWith("http")) return pic;
  return `${API_URL}/uploads/${pic}`;
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
  "3 Months",
  "40 Days",
  "1 Month",
  "2 Months",
  "6 Months",
  "1 Year",
];

export const DURATION_DAYS = {
  "3 Months": 90,
  "40 Days": 40,
  "1 Month": 30,
  "2 Months": 60,
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

export const STATUS_OPTIONS = ["Active", "Completed", "Dropped", "On Hold"];
