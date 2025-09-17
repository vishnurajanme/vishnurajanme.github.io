import React from "react";
import { motion } from "framer-motion";
import { projects } from "../content";
import {
  FaFileContract,
  FaCogs,
  FaFlask,
  FaAndroid,
  FaGooglePlay,
  FaCertificate,
} from "react-icons/fa";
import ScrollToTop from "../components/ScrollToTop";

// --- MODIFIED: Helper function now returns icons for projects ---
const getIconForProject = (type, title) => {
  const lowerType = type.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (lowerType.includes("funded")) return <FaFileContract />;
  if (lowerType.includes("patent")) return <FaCertificate />;
  if (lowerType.includes("app") && lowerTitle.includes("android")) return <FaAndroid />;
  if (lowerType.includes("app")) return <FaGooglePlay />;
  if (lowerType.includes("consultancy")) return <FaCogs />;
  return <FaFlask />;
};

// --- Group projects by year ---
const projectsByYear = projects.reduce((acc, project) => {
  const year = project.year;
  if (!acc[year]) acc[year] = [];
  acc[year].push(project);
  return acc;
}, {});

// --- Sort years in descending order ---
const sortedYears = Object.keys(projectsByYear).sort((a, b) => b - a);

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
// --- Timeline Card ---
const ProjectCard = React.memo(({ project, isLeft, animateOnLoad }) => {
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
        <div
          className={`absolute top-8 w-3 h-3 bg-gray-800 border-t border-r border-purple-700/80 transform rotate-45 group-hover:bg-purple-800 transition-colors duration-300 z-10 ${
            isLeft
              ? "right-0 translate-x-1/2"
              : "left-0 -translate-x-1/2 rotate-[-135deg]"
          }`}
        ></div>
        <div className="relative bg-gray-900 rounded-[15px] h-full overflow-hidden flex flex-col p-6">
          <div className="flex items-center mb-3">
            <span className="text-purple-400 text-2xl mr-3">
              {getIconForProject(project.type, project.title)}
            </span>
            <h3 className="font-semibold text-purple-300 uppercase tracking-wider text-sm">
              {project.type}
            </h3>
          </div>

          <p className="text-lg font-bold text-white leading-tight mb-3 flex-grow">
            {project.title}
          </p>

          <div className="border-t border-purple-800/50 my-3"></div>

          <div className="flex flex-col text-xs text-gray-400">
            <span className="font-medium">{project.fundingAgency}</span>
            {project.amount && (
              <span className="text-green-400 font-semibold">
                ₹{project.amount.toLocaleString()}
              </span>
            )}
            <span className="font-mono mt-1">{project.year}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});


// --- Main Projects Page ---
export default function Projects() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Patents, Funded Projects & Apps
            </h1>
            <p className="text-lg text-purple-300">
              A timeline of my innovations, projects undertaken, and apps developed.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-purple-800/50 transform md:-translate-x-1/2" />
            <div>
              {sortedYears.map((year) => {
                const yearProjects = projectsByYear[year];
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

                    {/* Desktop View */}
                    <div className="hidden md:block">
                      {(() => {
                        const pairedProjects = [];
                        for (let i = 0; i < yearProjects.length; i += 2) {
                          pairedProjects.push([yearProjects[i], yearProjects[i + 1]]);
                        }
                        return pairedProjects.map((pair, pairIndex) => {
                          const [left, right] = pair;
                          const animateLeft = desktopCardCount < 4;
                          if (left) desktopCardCount++;
                          const animateRight = desktopCardCount < 4;
                          if (right) desktopCardCount++;

                          return (
                            <div
                              key={pairIndex}
                              className="relative mb-8 flex justify-between items-start w-full"
                            >
                              <div className="w-5/12">
                                {left && (
                                  <ProjectCard
                                    project={left}
                                    isLeft={true}
                                    animateOnLoad={animateLeft}
                                  />
                                )}
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
                                {right && (
                                  <ProjectCard
                                    project={right}
                                    isLeft={false}
                                    animateOnLoad={animateRight}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden">
                      {yearProjects.map((project, index) => {
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
                            <ProjectCard
                              project={project}
                              isLeft={false}
                              animateOnLoad={animateMobile}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
