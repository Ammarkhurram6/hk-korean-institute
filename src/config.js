const rawUrl =
  import.meta.env.VITE_API_URL ||
  "https://hk-korean-institute-production-28f8.up.railway.app";

const API_URL = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

export default API_URL;
