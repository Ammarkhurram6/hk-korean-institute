import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiAlertCircle, FiLoader } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (error) {
      setError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy dark:bg-charcoal relative overflow-hidden px-4">
      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-kred/20 rounded-full filter blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-kred text-white flex items-center justify-center text-2xl font-display font-bold shadow-lg shadow-kred/30">
              HK
            </div>
            <h1 className="text-3xl font-display font-bold text-white">
              Admin Portal
            </h1>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">
              HK Institute of Korean Language
            </p>
          </div>

          {error && (
            <motion.div
              className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <FiAlertCircle className="text-lg flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-kred focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-kred focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2 bg-kred hover:bg-kred/90 disabled:bg-gray-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-kred/20"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
