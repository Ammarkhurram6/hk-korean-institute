let rawUrl =
  import.meta.env.VITE_API_URL ||
  "https://hk-korean-institute-production.up.railway.app";

// Yeh ensure karega ke agar http/https na ho toh khud add ho jaye
const API_URL = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

export default API_URL;
