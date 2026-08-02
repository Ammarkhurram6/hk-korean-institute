import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Teachers = () => {
  const teachers = [
    {
      name: "Kim Ji-won",
      qual: "M.A. in Korean Linguistics",
      exp: "10+ Years",
      spec: "TOPIK Expert",
      // img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1587&auto=format&fit=crop",
    },
    {
      name: "Park Min-ho",
      qual: "B.A. in Education",
      exp: "7+ Years",
      spec: "Spoken Korean",
      // img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1587&auto=format&fit=crop",
    },
    {
      name: "Lee Eun-ji",
      qual: "PhD Candidate",
      exp: "5+ Years",
      spec: "Beginner Specialist",
      // img: "https://images.unsplash.com/photo-1580489944761-15a4a652dc65?q=80&w=1587&auto=format&fit=crop",
    },
  ];

  return (
    <section id="teachers" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Meet Our Certified Teachers
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn from the best native and certified instructors in the
            industry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teachers.map((teacher, i) => (
            <motion.div
              key={i}
              className="group relative rounded-3xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <img
                src={teacher.img}
                alt={teacher.name}
                className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold">{teacher.name}</h3>
                <p className="text-kred font-medium mb-2">{teacher.spec}</p>
                <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100">
                  <p className="text-sm text-gray-200 mb-1">
                    Qualification: {teacher.qual}
                  </p>
                  <p className="text-sm text-gray-200 mb-4">
                    Experience: {teacher.exp}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-kred transition-colors"
                    >
                      <FaFacebookF size={14} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-kred transition-colors"
                    >
                      <FaTwitter size={14} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-kred transition-colors"
                    >
                      <FaLinkedinIn size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teachers;
