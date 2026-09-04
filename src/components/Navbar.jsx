import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Check if we are on the apply page
  const isApplyPage = location.pathname === "/apply";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }

    setDarkMode(!darkMode);
  };

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Courses", href: "/#courses" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/", "");
      if (window.location.pathname !== "/") {
        window.location.href = href;
      } else {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    setIsOpen(false);
  };

  // Force solid navbar on apply page or when scrolled
  const showSolidNavbar = scrolled || isApplyPage;

  return (
    <>
      <ScrollProgress />

      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          showSolidNavbar
            ? "bg-white/90 dark:bg-navy/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100 dark:border-white/10"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 text-2xl font-display font-bold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
              showSolidNavbar ? "text-navy dark:text-white" : "text-white"
            }`}
          >
            <span className="text-kred text-3xl">HK</span>
            Institute
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm font-medium transition-colors relative group cursor-pointer ${
                  showSolidNavbar
                    ? "text-charcoal dark:text-white hover:text-kred"
                    : "text-white hover:text-kred"
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kred group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className={`text-xl transition-colors duration-300 ${
                showSolidNavbar ? "text-charcoal dark:text-white" : "text-white"
              }`}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* APPLY NOW */}
            <Link to="/apply" className="btn-primary text-sm" target="_blank">
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4 z-[70]">
            <button
              onClick={toggleDarkMode}
              className={`text-xl transition-colors duration-300 ${
                showSolidNavbar ? "text-charcoal dark:text-white" : "text-white"
              }`}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-2xl transition-colors duration-300 ${
                showSolidNavbar ? "text-charcoal dark:text-white" : "text-white"
              }`}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 mx-4 rounded-2xl absolute left-0 right-0 z-[60] shadow-2xl p-6 bg-white dark:bg-navy border border-gray-100 dark:border-white/10"
            >
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-medium transition-colors text-lg text-charcoal dark:text-white hover:text-kred"
                  >
                    {link.name}
                  </a>
                ))}

                <Link
                  to="/apply"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-center mt-2"
                  target="_blank"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-kred to-navy z-[60]"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

export default Navbar;
