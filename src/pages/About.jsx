import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaFacebook, FaGooglePlay, FaGoogle } from "react-icons/fa";

export default function About() {
  return (
    // Outer container for the full-width background and top padding
    <div className="bg-gradient-to-br from-black to-purple-950 min-h-screen font-sans text-white">
      <section className="max-w-6xl mx-auto px-4 py-16 pt-10 space-y-16">
        {/* Hero Section */}
              <div style={{ marginTop: "100px" }}></div> {/* Spacer */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-white">Dr. Vishnu Rajan</h1>
          <p className="mt-4 text-xl italic text-gray-400">
            “Passionate about AI, ML and Android development creating innovative solutions for the world”
          </p>
        </motion.div>

        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-gray-900 p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">About Me</h2>
          <p className="leading-relaxed text-lg text-gray-200 text-justify">
            I am an academician, entrepreneur, and technology enthusiast with deep expertise 
            in Android app development and intelligent systems. Founder of <strong>BitSky</strong>, 
            an MSME recognized by the Government of India, I build and publish apps on the 
            Google Play Store. Currently, I serve as a <strong>Subject Matter Expert in Android </strong> 
            at Internshala and as an <strong>Associate Professor</strong> in Electronics & Communication Engineering 
            at Sahrdaya College of Engineering and Technology, Kerala.
          </p>
        </motion.div>

        {/* Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Android App Development (Kotlin, Jetpack Compose)",
              "Artificial Intelligence & Machine Learning",
              "Signal Processing & Embedded Systems",
              "Mentorship in Python, Flutter, C++, MATLAB"
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 p-6 rounded-xl shadow-md"
              >
                <p className="font-semibold text-gray-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Highlights</h2>
          <ul className="space-y-6 text-gray-200">
            
            <li className="border-l-4 border-blue-500 pl-4">
              Holds two patents in AI/ML & Signal Processing.
            </li>
            
            <li className="border-l-4 border-pink-500 pl-4">
              Resource person for 100+ workshops, FDPs, and conferences.
            </li>
            <li className="border-l-4 border-purple-500 pl-4">
              Guided multiple award-winning student projects and published 15+ papers.
            </li>
            <li className="border-l-4 border-green-500 pl-4">
              Organizer of national-level events like Android Campus Fest 2023, Google AI Fest 2023 GIH 2024 & 2025
            </li>
          </ul>
        </motion.div>

      </section>
    </div>
  );
}
