import React from 'react';
import { motion } from 'framer-motion';
import useTypewriter from '../hooks/useTypewriter'; // Import path is unchanged

const roles = ["Educator.", "Developer.", "Consultant."];

export default function HeroText() {
  const { displayedText, isTyping } = useTypewriter(roles);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col sm:flex-row justify-center items-center relative">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none glitch"
        >
          VISHNU
        </motion.h1>
        <div style={{ marginLeft: "25px" }}></div>
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none glitch"
        >
          RAJAN
        </motion.h1>
      </div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-3 text-lg md:text-2xl text-gray-400 font-mono"
      >
        <span className="text-purple-400">~/</span>
        <span className="cursor-blink">{displayedText}</span>
        {isTyping && <span className="typing-cursor">_</span>}
      </motion.h2>
    </div>
  );
}