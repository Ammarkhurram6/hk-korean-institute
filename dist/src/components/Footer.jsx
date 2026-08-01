import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-navy dark:bg-black text-white pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4">
              <span className="text-kred">HK</span> Institute
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional Korean Language Courses for Study, Career & Success.
              Unlock your future with us.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kred flex items-center justify-center transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kred flex items-center justify-center transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kred flex items-center justify-center transition-colors"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kred flex items-center justify-center transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#about" className="hover:text-kred transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#admission"
                  className="hover:text-kred transition-colors"
                >
                  Admission Process
                </a>
              </li>
              <li>
                <a
                  href="#teachers"
                  className="hover:text-kred transition-colors"
                >
                  Meet Our Teachers
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-kred transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Courses</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="#courses"
                  className="hover:text-kred transition-colors"
                >
                  Beginner Korean
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="hover:text-kred transition-colors"
                >
                  TOPIK Preparation
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="hover:text-kred transition-colors"
                >
                  Spoken Korean
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="hover:text-kred transition-colors"
                >
                  Weekend Batches
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>123 Kimchi Plaza, Tsim Sha Tsui, Hong Kong</li>
              <li>+852 1234 5678</li>
              <li>info@hkkorean.edu</li>
              <li>Mon - Fri: 9:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} HK Institute of Korean Language. All
            Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-kred transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-kred transition-colors">
              Terms & Conditions
            </a>
            <p>
              Crafted with ❤️ by{" "}
              <span className="text-white">UI/UX Expert</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
