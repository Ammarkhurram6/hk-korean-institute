import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const images = [
    {
      src: "https://plus.unsplash.com/premium_photo-1661936414165-3039a8d906f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VvdWwlMjBza3lsaW5lfGVufDB8fDB8fHww",
      alt: "Seoul Skyline",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://media.istockphoto.com/id/517973380/photo/seoul-south-korea-skyline.webp?a=1&b=1&s=612x612&w=0&k=20&c=7fIXAHOt2DVHRH2WFhGVAevwnv4VbrQfIY8N7H0ju-M=",
      alt: "Gyeongbokgung Palace",
    },
    {
      src: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1587&auto=format&fit=crop",
      alt: "Cherry Blossoms",
    },
    {
      src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkoGGIZCFmZsyExqaktED8OXkZpbbn7PIvMVXfrx5AJFE48_XJyQm_Mwc9I4fngoVmKMZvyntuflvgcnM1FxQchksRTUUH2wiXacDCFWzuFCiPSjnLDzafCqi2o2MDA5H_zKkfL2EjV0Ljb=w408-h306-k-no",
      alt: "Korean Classroom",
    },
    {
      src: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1587&auto=format&fit=crop",
      alt: "N Seoul Tower",
    },
    {
      src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1587&auto=format&fit=crop",
      alt: "Traditional Hanok",
    },
  ];

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Korea Through Our Lens
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedImg(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <h4 className="text-white font-semibold text-lg">{img.alt}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
            >
              <button className="absolute top-6 right-6 text-white text-3xl">
                <FaTimes />
              </button>
              <motion.img
                src={selectedImg}
                alt="Enlarged"
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
