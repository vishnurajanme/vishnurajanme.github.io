import React from 'react';
import { motion } from "framer-motion";
import { services } from "../content";
import {
  FaGavel,
  FaUsers,
  FaCog,
  FaFileContract,
  FaBug,
  FaGoogle,
  FaAndroid,
  FaDesktop
} from 'react-icons/fa';
import ScrollToTop from "../components/ScrollToTop"; // 1. Import the component

// --- MODIFIED: Helper function now returns React Icon components ---
// The size and color are controlled by the parent span's className in TimelineCard.
const getIconForRole = (role) => {
  const lowerCaseRole = role.toLowerCase();
  
  if (lowerCaseRole.includes("session chair")) return <FaGavel />;
  if (lowerCaseRole.includes("panellist") || lowerCaseRole.includes("panelist")) return <FaUsers />;
  if (lowerCaseRole.includes("consultancy")) return <FaCog />;
  if (lowerCaseRole.includes("internship")) return <FaFileContract />;
  if (lowerCaseRole.includes("alpha tester")) return <FaBug />;
  if (lowerCaseRole.includes("google")) return <FaGoogle />;
  if (lowerCaseRole.includes("android")) return <FaAndroid />;
  
  // Default icon
  return <FaDesktop />;
};


// --- Helper function to extract the year from a date string ---
const getYear = (dateString) => {
  const match = dateString.match(/\d{4}/);
  return match ? match[0] : "N/A";
};

// --- Group services by year for timeline structure ---
const servicesByYear = services.reduce((acc, service) => {
  const year = getYear(service.date);
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(service);
  return acc;
}, {});

// --- Sort years in descending order ---
const sortedYears = Object.keys(servicesByYear).sort((a, b) => b - a);


// --- Framer Motion Animation Variants ---
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

// --- Timeline Card Sub-component ---
const TimelineCard = React.memo(({ service, isLeft, animateOnLoad }) => {
  const bgImage = service.image ? service.image : '/services/default.png';
  const animationProps = animateOnLoad
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, amount: 0.5 } };

  return (
    <motion.div
      className="w-full group"
      variants={itemVariants(isLeft)}
      initial="hidden"
      {...animationProps}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative p-[1px] bg-gradient-to-br from-purple-700 to-purple-950 rounded-2xl">
        <div className={`absolute top-8 w-3 h-3 bg-gray-800 border-t border-r border-purple-700/80 transform rotate-45 group-hover:bg-purple-800 transition-colors duration-300 z-10 ${ isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2 rotate-[-135deg]" }`}></div>
        <div className="relative bg-gray-900 rounded-[15px] h-full overflow-hidden flex flex-col">
          <div className="w-full">
            <img 
              src={bgImage} 
              alt={service.program} 
              className="w-full h-auto object-cover" 
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center mb-3">
                <span className="text-purple-400 text-2xl mr-3">{getIconForRole(service.role)}</span>
                <h3 className="font-semibold text-purple-300 uppercase tracking-wider text-sm">{service.role}</h3>
              </div>
              <p className="text-lg font-bold text-white leading-tight mb-3 flex-grow">{service.program}</p>
              <div className="border-t border-purple-800/50 my-3"></div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-medium">{service.org}</span>
                  <span className="font-mono">{service.date}</span>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// --- Main Services Page Component ---
export default function Services() {
  let desktopCardCount = 0;
  let mobileCardCount = 0;

  return (
    <div className="font-sans text-white antialiased">
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-black to-purple-950" />
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16 pt-24 space-y-16 overflow-x-hidden">
          <div style={{ marginTop: "100px" }}></div>
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
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-purple-800/50 transform md:-translate-x-1/2" />
            <div>
              {sortedYears.map((year) => {
                const yearServices = servicesByYear[year];
                return (
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
                    
                    <div className="hidden md:block">
                      {(() => {
                        const pairedServices = [];
                        for (let i = 0; i < yearServices.length; i += 2) {
                          pairedServices.push([yearServices[i], yearServices[i+1]]);
                        }
                        return pairedServices.map((pair, pairIndex) => {
                          const [leftService, rightService] = pair;
                          const animateLeft = desktopCardCount < 4;
                          if(leftService) desktopCardCount++;
                          const animateRight = desktopCardCount < 4;
                          if(rightService) desktopCardCount++;
                          
                          return (
                            <div key={pairIndex} className="relative mb-8 flex justify-between items-start w-full">
                              <div className="w-5/12">
                                {leftService && <TimelineCard service={leftService} isLeft={true} animateOnLoad={animateLeft} />}
                              </div>
                              <motion.div
                                className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10"
                                variants={popInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.8 }}
                              >
                                <div className="w-4 h-4 bg-white rounded-full border-4 border-purple-500"></div>
                              </motion.div>
                              <div className="w-5/12">
                                {rightService && <TimelineCard service={rightService} isLeft={false} animateOnLoad={animateRight} />}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="block md:hidden">
                      {yearServices.map((service, index) => {
                        const animateMobile = mobileCardCount < 4;
                        mobileCardCount++;
                        
                        return (
                          <div key={index} className="relative mb-8 pl-12">
                            <motion.div
                              className="absolute left-4 top-8 transform -translate-x-1/2 z-10"
                              variants={popInVariants}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.8 }}
                            >
                              <div className="w-4 h-4 bg-white rounded-full border-4 border-purple-500"></div>
                            </motion.div>
                            <TimelineCard service={service} isLeft={false} animateOnLoad={animateMobile} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}