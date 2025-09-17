import React from 'react';
import { motion } from "framer-motion";
import {trainings} from '../content'
import {moocs} from '../content'
import ScrollToTop from '../components/ScrollToTop'; // 1. Import the component


// --- MODIFIED: InfoCard now accepts `animateOnLoad` prop ---
const InfoCard = ({ item, type, animateOnLoad }) => {
    const isTraining = type === 'training';
    const title = item.name;
    const detail1 = isTraining ? item.institution : item.provider;
    const detail2 = item.timeline;

    // Conditionally set animation props
    const animationProps = animateOnLoad
        ? { animate: { opacity: 1, y: 0 } } // Animate immediately
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 } }; // Animate on scroll

    return (
        <motion.div
            className="relative p-[1px] bg-gradient-to-br from-purple-700/50 to-purple-950/30 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            {...animationProps} // Apply the conditional props
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-[7px] h-full flex flex-col">
                <p className="text-base font-semibold text-white leading-tight flex-grow">{title}</p>
                <div className="border-t border-purple-800/30 my-3"></div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="font-medium italic">{detail1}</span>
                    <span className="font-mono">{detail2}</span>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---
export default function TrainingsAndMoocsPage() {
  return (
    <div className="font-sans text-white antialiased">
      
      {/* Fixed background */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-black to-purple-950" />

      {/* Scrollable content container */}
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 py-16 pt-24 space-y-16">
          <div style={{ marginTop: "100px" }}></div> {/* Spacer */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {/* Trainings Section */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center md:text-left mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Trainings & FDPs</h1>
                <p className="text-lg text-purple-300">Offline Training Programs attended.</p>
              </motion.div>
              <div className="space-y-4">
                {trainings.map((item, index) => (
                    // --- MODIFIED: Pass animateOnLoad to the first 5 cards ---
                    <InfoCard 
                        key={`training-${index}`} 
                        item={item} 
                        type="training" 
                        animateOnLoad={index < 5} 
                    />
                ))}
              </div>
            </div>

            {/* MOOCs Section */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-center md:text-left mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">MOOCs</h1>
                <p className="text-lg text-purple-300">Massive Open Online Courses and specializations completed.</p>
              </motion.div>
              <div className="space-y-4">
                {moocs.map((item, index) => (
                    // --- MODIFIED: Pass animateOnLoad to the first 5 cards ---
                    <InfoCard 
                        key={`mooc-${index}`} 
                        item={item} 
                        type="mooc"
                        animateOnLoad={index < 5} 
                    />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}