import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Data Constants ---
// Moving data outside the component makes it cleaner and easier to manage.
const expertiseAreas = [
  { title: "Android App Development", skills: "Kotlin, Jetpack Compose, Flutter" },
  { title: "AI & Machine Learning", skills: "Model Development, Data Analysis" },
  { title: "Signal Processing & IoT", skills: "Embedded Systems, Sensor Integration" },
  { title: "Frontend Development", skills: "React, Vite, TailwindCSS" },
  { title: "Mentorship", skills: "Python, C++, MATLAB" },
];

const contributions = {
  "Leadership & Mentorship": [
    "Chaired multiple National & International Conferences.",
    "Organizer for events like Android Campus Fest 2023, Google AI Fest 2023, and GIH 2024 & 2025.",
    "IEEE Senior Member & IAYPC IEEE India Council Mentor.",
    "ATL Mentor of Change for NITI Aayog & KDISC STRIDE State Level Mentor.",
    "Guided numerous award-winning student projects.",
    "Resource person for dozens of workshops, FDPs, and conferences.",
    "Faculty mentor to the Hardware Club, Student Council (2023-25), and GDG (2021-25).",
  ],
  "Awards & Recognition": [
    "Featured in Google’s Android Educators Newsletter (July 2022 & May 2023).",
    "Recipient of the Best Employee Award 2009 from SGS (Acer Division).",
    "Featured in prominent media for humanitarian project guidance.",
  ],
  "Professional Affiliations & Publications": [
    "Published over 15 research papers in esteemed journals.",
    "Regular reviewer for SCI-indexed and 10+ UGC-approved journals.",
    "Senior Member of IEEE and a Life Member of ISTE, IE, IAENG, IFERP, and IAOE.",
    "Active member of the Google Developers Educator Program, India.",
  ],
};

const borderColors = [
  "border-pink-400", "border-rose-500", "border-indigo-500", "border-teal-500",
  "border-yellow-500", "border-purple-500", "border-lime-500", "border-orange-500",
  "border-red-500", "border-green-500"
];

// --- Reusable Animated Section Component ---
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function About() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // If not scrollable, hide the arrow
      if (scrollHeight <= clientHeight) {
        setShowScrollIndicator(false);
        return;
      }

      // If scrollable, check if we are at the bottom
      const isAtBottom = window.innerHeight + window.scrollY >= scrollHeight - 5;
      setShowScrollIndicator(!isAtBottom);
    };

    // Listen for scroll and resize events
    window.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability, { passive: true });

    // Initial check after a short delay to allow content to render
    const timer = setTimeout(checkScrollability, 100);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-purple-950 min-h-screen font-sans text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28">
        {/* --- Hero Section --- */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Dr. Vishnu Rajan
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              Innovating at the intersection of AI, Mobile Development, and Education.
            </p>
          </div>
        </AnimatedSection>

        {/* --- About Me Section --- */}
        <AnimatedSection delay={0.2}>
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-white/10">
            <h2 className="text-3xl font-bold mb-4 text-white">About Me</h2>
            <div className="space-y-4 text-lg text-gray-300 text-justify leading-relaxed">
              <p>
                I am an academic, entrepreneur, and technology leader with over 13 years of experience specializing in Android development (Kotlin, Flutter, Jetpack Compose), AI/ML, and IoT systems. As the founder of BitSky, I have successfully developed and published over 15 applications on the Google Play Store.
              </p>
              <p>
                Currently, I serve as an Associate Professor in Electronics & Communication Engineering at Sahrdaya College of Engineering and Technology. In parallel, I leverage my industry expertise as a Subject Matter Expert and Consultant for Android at Internshala.
              </p>
              <p>
                A passionate innovator and Senior Member of IEEE, I actively contribute to the tech ecosystem as an ATL Mentor of Change for NITI Aayog and a KDISC STRIDE State Level Mentor, dedicated to shaping the next generation of engineers.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* --- Expertise Section --- */}
        <AnimatedSection delay={0.3}>
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Areas of Expertise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseAreas.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(168, 85, 247, 0.3)" }}
                  className="bg-gray-900/50 p-6 rounded-xl shadow-md ring-1 ring-white/10 transition-shadow duration-300"
                >
                  <h3 className="font-bold text-xl text-purple-300">{item.title}</h3>
                  <p className="font-light text-gray-400 mt-1">{item.skills}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* --- Contributions Section --- */}
        <AnimatedSection delay={0.4}>
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Notable Contributions</h2>
            <div className="space-y-12">
              {Object.entries(contributions).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-2xl font-semibold mb-4 text-purple-300 border-b-2 border-purple-500/30 pb-2">
                    {category}
                  </h3>
                  <ul className="space-y-4 text-gray-300">
                    {items.map((item, idx) => (
                      <li
                        key={idx}
                        className={`border-l-4 ${borderColors[idx % borderColors.length]} pl-4 py-1 transition-all duration-300 hover:bg-white/5 hover:pl-6`}
                      >
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* --- Scroll Down Indicator --- */}
      {showScrollIndicator && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
              <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="p-2 bg-purple-500/20 rounded-full"
              >
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
              </motion.div>
          </motion.div>
      )}
    </div>
  );
}

