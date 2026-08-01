import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Stats = () => {
  const stats = [
    { value: 500, suffix: "+", label: "Students" },
    { value: 95, suffix: "%", label: "Success Rate" },
    { value: 10, suffix: "+", label: "Professional Courses" },
    { value: 5, suffix: "+", label: "Years of Excellence" },
  ];

  return (
    <section className="py-20 bg-kred text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <Counter key={i} {...stat} delay={i * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter = ({ value, suffix, label, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = value / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <h3 className="text-4xl md:text-6xl font-bold mb-2">
        {count}
        {suffix}
      </h3>
      <p className="text-lg text-white/80 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
};

export default Stats;
