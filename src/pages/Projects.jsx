import React from "react";
import { motion } from "framer-motion";
import {projects} from "../content";

export default function Projects() {

  return (
    <div className="bg-gradient-to-br from-black to-purple-950 min-h-screen font-sans text-white">
      <section className="max-w-6xl mx-auto px-4 py-16 pt-10 space-y-16">
                      <div style={{ marginTop: "100px" }}></div> {/* Spacer */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            My Creative Ventures
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            A showcase of my passion for building innovative and meaningful projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch justify-center">
          {projects.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-gray-900 p-8 rounded-3xl shadow-lg flex flex-col hover:bg-gray-800 transition-colors duration-300 h-full"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">
                {p.title}
                <span className="text-sm text-gray-400 font-normal ml-2">({p.when})</span>
              </h2>
              <p className="mt-1 text-gray-200 flex-1">{p.blurb}</p>
              <a 
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors self-start"
              >
                Learn more
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
