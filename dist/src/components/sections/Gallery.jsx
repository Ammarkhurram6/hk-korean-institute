import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1538485399081-7c8ed7144b6c?q=80&w=2070&auto=format&fit=crop",
      alt: "Seoul Skyline",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1545569310-ace897b1a322?q=80&w=1587&auto=format&fit=crop",
      alt: "Gyeongbokgung Palace",
    },
    {
      src: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1587&auto=format&fit=crop",
      alt: "Cherry Blossoms",
    },
    {
      src: "https://images.unsplash.com/photo-1571043733612-d5444ff1e9e8?q=80&w=1587&auto=format&fit=crop",
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
