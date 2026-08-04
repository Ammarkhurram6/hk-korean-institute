import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState } from "react";
import API_URL from "../../config";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setErrorMessage(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      setErrorMessage(
        "Could not connect to the server. Is the backend running?",
      );
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      value: "+92 343 6808080",
      sub: "Mon-Fri 9am-8pm",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      value: "Hkilt06@gmail.com",
      sub: "24/7 Support",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      value: "Al Rehman Palace, 1 Muslim, Town",
      sub: "Lahore, Pakistan",
    },
    {
      icon: <FaClock />,
      title: "Office Hours",
      value: "9:00 AM - 8:00 PM",
      sub: "Monday to Saturday",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-kred font-semibold uppercase tracking-wider">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-navy dark:text-white">
            Start Your Journey Today
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  className="glass-card p-6 rounded-2xl flex flex-col gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-kred text-white flex items-center justify-center text-xl mb-2">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-navy dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    {item.value}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-64 border-4 border-white dark:border-navy/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.217812051812!2d74.31705267398172!3d31.518177147253255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919057721ade16f%3A0x320ef78607494670!2sHK%20Institute%20of%20Korean%20Language!5e0!3m2!1sen!2s!4v1785571553511!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-lightgray dark:bg-navy/20 p-8 rounded-3xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-navy dark:text-white mb-6">
              Send us a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-kred focus:outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Enter Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-kred focus:outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Enter your Gmail"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-kred focus:outline-none transition-all resize-none text-gray-900 dark:text-white"
                  placeholder="I'm interested in the Beginner Korean course..."
                ></textarea>
              </div>

              {success && (
                <motion.p
                  className="text-green-500 font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.p>
              )}

              {errorMessage && (
                <motion.p
                  className="text-red-500 font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ {errorMessage}
                </motion.p>
              )}

              <button type="submit" className="btn-primary w-full text-lg">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
