import { motion } from "framer-motion";

const Admission = () => {
  const steps = [
    {
      title: "Submit Application",
      desc: "Fill out our online application form with your details.",
    },
    {
      title: "Counseling",
      desc: "Meet with our advisors to choose the right course.",
    },
    {
      title: "Registration",
      desc: "Complete your registration and select your batch.",
    },
    {
      title: "Fee Submission",
      desc: "Pay your course fee securely online or at our office.",
    },
    {
      title: "Begin Classes",
      desc: "Start your Korean learning journey with us!",
    },
  ];

  return (
    <section id="admission" className="py-24 bg-lightgray dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Admission
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Admission Process
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A simple 5-step process to start your journey.
          </p>
        </motion.div>

        <div className="relative">
          {/* Line */}
          <div className="absolute top-12 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 hidden md:block">
            <motion.div
              className="h-full bg-kred"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.3 }}
              >
                <div className="w-24 h-24 rounded-full bg-white dark:bg-navy border-4 border-kred flex items-center justify-center text-3xl font-bold text-kred mb-4 z-10 shadow-lg">
                  {i + 1}
                </div>
                <h4 className="text-lg font-semibold text-navy dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admission;
