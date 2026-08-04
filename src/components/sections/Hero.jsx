import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const phrases = [
  "Learn Korean",
  "Unlock Your Future",
  "Study in Seoul",
  "Boost Your Career",
  "Get Korean Work Visa via OEC",
];

const Hero = () => {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentPhrase.substring(0, text.length + 1));
          if (text === currentPhrase) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setText(currentPhrase.substring(0, text.length - 1));
          if (text === "") {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/34860711/pexels-photo-34860711.jpeg"
          alt="Seoul Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-kred/60 dark:bg-charcoal/90"></div>
      </div>

      {/* Floating Korean Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {["안녕하세요", "학교", "사랑", "미래", "한국어", "성공"].map(
          (word, i) => (
            <motion.span
              key={i}
              className="absolute text-white/20 font-display text-4xl md:text-6xl font-bold"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {word}
            </motion.span>
          ),
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-20 text-center text-white">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold mb-6 min-h-[100px] md:min-h-[150px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-3xl md:text-5xl font-normal text-gray-300 mb-2">
            Welcome to HK Institute
          </span>
          <span className="text-kred">{text}</span>
          <span className="animate-pulse">|</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Professional Korean Language Courses for Study, Career & Success. Join
          Hammad Khurram premier Korean language institute today.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/apply"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="btn-primary text-center mt-2"
          >
            Apply Now
          </Link>
          <a
            href="#contact"
            className="btn-secondary text-lg bg-white/10 backdrop-blur-md border border-white/30"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
