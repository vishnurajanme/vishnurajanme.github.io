import React from "react";
// --- useRef is no longer needed as the scroll animation was removed ---
import { motion } from "framer-motion";
import { services } from "../content"; // Assuming your content is in ../content/index.js or similar

// --- Import Icons ---
import {
  FaChalkboardTeacher,
  FaGavel,
  FaUsers,
  FaCogs,
  FaGoogle,
  FaClipboardCheck,
  FaAndroid,
} from "react-icons/fa";
import { GiTechnoHeart } from "react-icons/gi";

// --- All helper functions and data processing remain the same ---

const getIconForRole = (role) => {
  const lowerCaseRole = role.toLowerCase();
  if (lowerCaseRole.includes("session chair")) return <FaGavel />;
  if (lowerCaseRole.includes("panellist") || lowerCaseRole.includes("panelist")) return <FaUsers />;
  if (lowerCaseRole.includes("consultancy")) return <FaCogs />;
  if (lowerCaseRole.includes("internship")) return <FaClipboardCheck />;
  if (lowerCaseRole.includes("alpha tester")) return <GiTechnoHeart />;
  if (lowerCaseRole.includes("google") || lowerCaseRole.includes("android")) return <FaAndroid />;
  return <FaChalkboardTeacher />;
};

const getYear = (dateString) => {
  const match = dateString.match(/\d{4}/);
  return match ? match[0] : "N/A";
};

const servicesByYear = services.reduce((acc, service) => {
  const year = getYear(service.date);
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(service);
  return acc;
}, {});

const sortedYears = Object.keys(servicesByYear).sort((a, b) => b - a);

const popInVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

const itemVariants = (isLeft) => ({
  hidden: { opacity: 0, x: isLeft ? -100 : 100, rotate: isLeft ? -10 : 10 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
});

const TimelineCard = React.memo(({ service, isLeft }) => {
  return (
    <motion.div
      className="w-full md:w-5/12 group"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative p-[1px] bg-gradient-to-br from-purple-700 to-purple-950 rounded-2xl">
        <div className="relative bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl h-full">
            <div className={`absolute top-8 w-3 h-3 bg-gray-800 border-t border-r border-purple-700/80 transform rotate-45 group-hover:bg-purple-800 transition-colors duration-300 ${ isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2 rotate-[-135deg]" }`}></div>
            <div className="flex items-center mb-3">
              <span className="text-purple-400 text-2xl mr-3">{getIconForRole(service.role)}</span>
              <h3 className="font-semibold text-purple-300 uppercase tracking-wider text-sm">{service.role}</h3>
            </div>
            <p className="text-lg font-bold text-white leading-tight mb-3">{service.program}</p>
            <div className="border-t border-purple-800/50 my-3"></div>
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="font-medium">{service.org}</span>
                <span className="font-mono">{service.date}</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
});

const TimelineItem = React.memo(({ service, index }) => {
  const isLeft = index % 2 === 0;
  return (
    <motion.div
      className={`relative mb-8 flex w-full ${isLeft ? "justify-start" : "justify-end"}`}
      custom={isLeft}
      variants={itemVariants(isLeft)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.div
        className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10"
        variants={popInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
      >
        <div className="w-4 h-4 bg-white rounded-full border-4 border-purple-500"></div>
      </motion.div>
      <TimelineCard service={service} isLeft={isLeft} />
    </motion.div>
  );
});


export default function Services() {
  return (
    // The main wrapper still sets up the font and text color context.
    <div className="font-sans text-white antialiased">
      
      {/* THIS IS THE NEW FIXED BACKGROUND */}
      {/* It sits in the back (z-[-1]) and covers the entire screen (fixed inset-0) */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-black to-purple-950" />

      {/* This container now holds the scrollable content. Notice the background classes are gone. */}
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16 pt-24 space-y-16">
          <div style={{ marginTop: "100px" }}></div> {/* Spacer */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional Services</h1>
            <p className="text-lg text-purple-300">A timeline of my contributions as a resource person.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-purple-800/50 transform -translate-x-1/2" />
            
            <div>
              {sortedYears.map((year) => (
                <div key={year} className="mb-12">
                  <motion.div
                    className="flex justify-center mb-8"
                    variants={popInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.8 }}
                  >
                    <div className="z-10 bg-purple-600 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                      {year}
                    </div>
                  </motion.div>
                  {servicesByYear[year].map((s, idx) => (
                    <TimelineItem key={s.program + idx} service={s} index={idx} />
                  ))}
                </div>
              ))}
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}