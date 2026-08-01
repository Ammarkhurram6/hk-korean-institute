import { motion } from "framer-motion";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 rounded-full bg-navy text-white shadow-lg hover:scale-110 transition-transform"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
      <motion.a
        href="https://wa.me/+923436808080"
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 rounded-full bg-green-500 text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
