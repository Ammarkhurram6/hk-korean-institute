import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Do I need any prior knowledge of Korean?",
      a: "No, our Beginner Korean course is designed for absolute beginners. We start right from learning the Hangul alphabet.",
    },
    {
      q: "What is the duration of each course?",
      a: "Course durations vary. Beginner courses are typically 3 months, while TOPIK preparation is an intensive 2-month program.",
    },
    {
      q: "What is EPS?",
      a: "EPS, or Employment Permit System, is a government-managed system of South Korea that allows eligible foreign workers from participating countries to legally work in Korea. Through EPS, workers can apply for employment, take the required Korean language test, receive job opportunities from eligible Korean employers, complete the employment contract and visa process, and enter Korea legally for work. The system also provides workers with employment rights and protections under Korean labor laws.",
    },
    {
      q: "Do you provide online classes?",
      a: "Yes, we offer fully interactive online classes for students who prefer learning from home.",
    },
    {
      q: "How can I apply for a course?",
      a: "You can apply by filling out the application form on our website or visiting our office during office hours.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-lightgray dark:bg-navy/10">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-charcoal rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="text-lg font-semibold text-navy dark:text-white">
                  {faq.q}
                </span>
                <span className="text-kred text-xl">
                  {openIndex === i ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
