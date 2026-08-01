import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-charcoal"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="w-24 h-24 border-t-4 border-kred border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute text-3xl font-display font-bold text-navy dark:text-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          HK
        </motion.div>
      </div>
      <motion.p
        className="mt-8 text-lg font-medium tracking-widest text-navy dark:text-white uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Korean Language Institute
      </motion.p>
    </motion.div>
  );
};

export default Loader;
