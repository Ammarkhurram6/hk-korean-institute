import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHome,
} from "react-icons/fa";
import classroomImg from "../../assets/images/classroom1.jpeg";

const About = () => {
  const features = [
    {
      icon: <FaUserGraduate />,
      title: "Years of Experience",
      desc: "Over 5+ years of excellence in language education.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Certified Teachers",
      desc: "Learn from native and certified Korean instructors.",
    },
    {
      icon: <FaBookOpen />,
      title: "Student-focused Learning",
      desc: "Personalized curriculum tailored to your pace.",
    },
    {
      icon: <FaHome />,
      title: "Modern Classrooms",
      desc: "State-of-the-art facilities for immersive learning.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-lightgray dark:bg-charcoal transition-colors"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src={classroomImg}
              alt="Korean Classroom"
              className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-10 -right-10 bg-kred text-white p-8 rounded-3xl shadow-xl hidden md:block">
              <h3 className="text-4xl font-bold">5+</h3>
              <p>Years of Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-kred font-semibold uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-navy dark:text-white">
              Welcome to HK Korean Language Institute
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We are dedicated to providing the highest quality Korean language
              education in Lahore. Our mission is to bridge cultures and open
              doors to international opportunities for our students. Our vision
              is to be the leading center for Korean language proficiency and
              cultural exchange in the region.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-2xl flex flex-col gap-3"
                >
                  <div className="text-3xl text-kred">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-navy dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
