import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import FloatingButtons from "./components/FloatingButtons";
import Admission from "./pages/Admission";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show the public Navbar/Footer on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          <ScrollToTop />

          {!isAdminPage && <Navbar />}

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />

                <Route path="/apply" element={<Admission />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </main>

          {!isAdminPage && <Footer />}

          {!isAdminPage && <FloatingButtons />}
        </div>
      )}
    </>
  );
}

export default App;
