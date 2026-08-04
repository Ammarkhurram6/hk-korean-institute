import { motion } from "framer-motion";
import { FaClock, FaSignal, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Courses = () => {
  const courses = [
    {
      title: "Beginner Korean",
      desc: "Start your journey with Hangul and basic grammar.",
      duration: "3 Months",
      level: "A1-A2",
      benefits: [
        "Basic Conversations",
        "Read & Write Hangul",
        "Everyday Vocabulary",
      ],
    },
    {
      title: "Intermediate Korean",
      desc: "Enhance fluency and understand complex sentences.",
      duration: "4 Months",
      level: "B1-B2",
      benefits: [
        "Fluent Conversations",
        "Grammar Mastery",
        "Idiomatic Expressions",
      ],
    },
    {
      title: "Advanced Korean",
      desc: "Master the language for professional and academic use.",
      duration: "6 Months",
      level: "C1-C2",
      benefits: ["Professional Writing", "Native Fluency", "Cultural Nuances"],
    },
    {
      title: "TOPIK Preparation",
      desc: "Crack the Test of Proficiency in Korean with high scores.",
      duration: "2 Months",
      level: "All Levels",
      benefits: ["Exam Strategies", "Mock Tests", "High Score Guarantee"],
    },
    {
      title: "Spoken Korean",
      desc: "Focus purely on speaking and listening skills.",
      duration: "1.5 Months",
      level: "A2+",
      benefits: [
        "Pronunciation Correction",
        "Real-life Scenarios",
        "Accent Training",
      ],
    },
    {
      title: "Online Classes",
      desc: "Learn Korean from the comfort of your home.",
      duration: "Flexible",
      level: "All Levels",
      benefits: [
        "Live Interactive Sessions",
        "Recorded Lectures",
        "Global Access",
      ],
    },
    {
      title: "Weekend Batches",
      desc: "Perfect for working professionals and students.",
      duration: "8 Weekends",
      level: "All Levels",
      benefits: [
        "Saturday & Sunday",
        "Intensive Practice",
        "Flexible Schedule",
      ],
    },
  ];

  return (
    <section id="courses" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Our Programs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Explore Our Premium Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from a wide range of courses designed to meet your specific
            learning goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              className="group relative bg-white dark:bg-navy/20 rounded-3xl shadow-lg p-8 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-kred/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3 relative z-10">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
                {course.desc}
              </p>

              <div className="flex gap-4 mb-6 text-sm relative z-10">
                <span className="flex items-center gap-2 text-navy dark:text-white">
                  <FaClock className="text-kred" /> {course.duration}
                </span>
                <span className="flex items-center gap-2 text-navy dark:text-white">
                  <FaSignal className="text-kred" /> {course.level}
                </span>
              </div>

              <ul className="space-y-2 mb-8 relative z-10">
                {course.benefits.map((b, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <FaCheckCircle className="text-green-500" /> {b}
                  </li>
                ))}
              </ul>

              <Link
                to="/apply"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Apply Now
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
