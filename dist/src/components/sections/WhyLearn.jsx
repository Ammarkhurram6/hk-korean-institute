import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaAward,
  FaBriefcase,
  FaGlobeAsia,
  FaBuilding,
  FaPlane,
  FaFilm,
  FaMusic,
  FaLandmark,
} from "react-icons/fa";

const WhyLearn = () => {
  const benefits = [
    {
      icon: <FaGraduationCap />,
      title: "Study in South Korea",
      color: "bg-blue-500",
    },
    { icon: <FaAward />, title: "Scholarships", color: "bg-yellow-500" },
    { icon: <FaBriefcase />, title: "Better Jobs", color: "bg-green-500" },
    {
      icon: <FaGlobeAsia />,
      title: "International Career",
      color: "bg-purple-500",
    },
    { icon: <FaBuilding />, title: "Korean Companies", color: "bg-red-500" },
    { icon: <FaPlane />, title: "Travel", color: "bg-indigo-500" },
    { icon: <FaFilm />, title: "K-Drama", color: "bg-pink-500" },
    { icon: <FaMusic />, title: "K-Pop", color: "bg-orange-500" },
    { icon: <FaLandmark />, title: "Korean Culture", color: "bg-teal-500" },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-navy to-charcoal text-white relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-kred/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Benefits
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Why Learn Korean?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Unlock a world of opportunities, from education and career to
            culture and entertainment.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -10 }}
            >
              <div
                className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-2xl text-white shadow-lg`}
              >
                {item.icon}
              </div>
              <h4 className="font-semibold text-lg">{item.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLearn;
