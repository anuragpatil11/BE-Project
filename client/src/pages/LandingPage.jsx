import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ShieldCheck,
  FileText,
  Users,
  BarChart2,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react";
import i2it_logo from "../assets/images/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleLoginClick = () => {
    navigate("/login-Page");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden text-black py-12 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated floating circles */}
          <motion.div
            className="absolute top-20 left-10 w-16 h-16 rounded-full bg-blue-100 opacity-50"
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-20 h-20 rounded-full bg-blue-100 opacity-50"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex flex-col md:flex-row gap-10 justify-center items-center w-full"
          >
            <a
              href="https://www.isquareit.edu.in/"
              className="flex flex-col items-center text-2xl font-semibold text-black"
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-24 md:w-24 md:h-28 mb-2 object-contain"
                src={i2it_logo}
                alt="i2it Logo"
              />
            </a>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h3 className="text-blue-500 text-xl font-bold">
                Hope Foundation's
              </h3>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                INTERNATIONAL INSTITUTE OF INFORMATION TECHNOLOGY (I²IT)
              </h1>
              <p className="text-gray-600">
                Approved by AICTE | Recognized by DTE, Govt. of Maharashtra |
                Affiliated to the Savitribai Phule Pune University
              </p>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-6 text-black hover:text-blue-600 transition-colors duration-300"
          >
            Compliance Management System
          </motion.h1>
        </div>
      </header>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Streamline I2IT's Compliance Process
          </h2>
          <p className="text-xl mb-8">
            Access your role-specific dashboard to manage compliances
            efficiently.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-lg"
          >
            Login to Dashboard <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 py-8 px-4 text-center text-gray-400"
      >
        <p>
          © {new Date().getFullYear()} I2IT Compliance Management System. All
          rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
