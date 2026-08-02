import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah ",
      course: "TOPIK Preparation",
      text: "The teachers are incredibly supportive. I passed TOPIK Level 5 with their guidance!",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1587&auto=format&fit=crop",
    },
    {
      name: "Adullah",
      course: "Spoken Korean",
      text: "I can now confidently converse in Korean with my clients. Highly recommend HK Institute.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1587&auto=format&fit=crop",
    },
    {
      name: "Fatima",
      course: "Beginner Korean",
      text: "The classes are fun and interactive. Learning Hangul was never this easy!",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1587&auto=format&fit=crop",
    },
    {
      name: "Awais",
      course: "Advanced Korean",
      text: "Professional environment and excellent curriculum. Best institute in Hong Kong.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-lightgray dark:bg-navy/10">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Student Success Stories
          </h2>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <motion.div
                className="bg-white dark:bg-charcoal rounded-3xl p-8 shadow-lg h-full flex flex-col"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-kred/20"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-navy dark:text-white">
                      {review.name}
                    </h4>
                    <p className="text-sm text-kred">{review.course}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic flex-grow">
                  "{review.text}"
                </p>
                <div className="mt-4 text-yellow-400">★★★★★</div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
