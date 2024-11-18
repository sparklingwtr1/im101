import React from "react";
import { motion } from "framer-motion";

const ThankYou = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="text-center max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="mb-6"
          >
            <svg
              className="w-16 h-16 mx-auto text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-4">
            Your submission has been received. We will get back to you soon!
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
