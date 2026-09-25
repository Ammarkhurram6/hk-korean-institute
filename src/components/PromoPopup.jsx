import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import promoImg from "../assets/images/banner.jpeg";

const PromoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Sirf main page (/) par popup dikhega
    if (location.pathname !== "/") {
      setIsVisible(false); // Agar user doosre page par jaye toh popup band
      return;
    }

    // 2 second baad popup khulega (page load hone ke baad)
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Jab popup khula ho toh background scroll band kar dein
  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  // ESC key se band karne ki facility
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsVisible(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVisible(false)}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-charcoal"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cross (Close) Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-kred transition-all"
              aria-label="Close popup"
            >
              <FiX className="text-lg" />
            </button>

            {/* Popup Photo */}
            <img
              src={promoImg}
              alt="Admissions Open"
              className="w-full h-auto object-contain"
            />

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-display font-bold text-navy dark:text-white mb-2">
                Admissions Open! 🎓
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                Learn Korean with certified teachers. Limited seats available —
                apply now and start your journey to Korea!
              </p>
              <Link
                to="/apply"
                onClick={() => setIsVisible(false)}
                className="btn-primary w-full text-center block text-base"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;
