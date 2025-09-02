import React from "react";
import { motion } from "framer-motion";
import { trainings, moocs } from "../content";

export default function Training() {
  return (
    // This parent wrapper sets the font and text color context for the whole component
    <div className="font-sans text-white">
      
      {/* 1. THE FIXED BACKGROUND */}
      {/* This div is fixed to the viewport, covers it (inset-0), and sits behind everything else (z-[-1]) */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-black to-purple-950" />

      {/* 2. THE SCROLLABLE CONTENT WRAPPER */}
      {/* This main element holds all the content that will scroll. Notice the background classes are removed. */}
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16 pt-10 space-y-16">
          {/* Trainings Section */}
          <div style={{ marginTop: "100px" }}></div> {/* Spacer */}
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl font-bold">Trainings Completed</h1>
            <ul className="mt-4 space-y-4">
              {trainings.map((t, idx) => (
                <li key={idx} className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                  <p className="text-gray-200">
                    <strong className="font-semibold">{t.name}</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t.timeline} — {t.institution}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* MOOC Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl font-bold mt-12">MOOC Courses</h1>
            <ul className="mt-4 space-y-4">
              {moocs.map((m, idx) => (
                <li key={idx} className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                  <p className="text-gray-200">
                    <strong className="font-semibold">{m.name}</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {m.timeline} — {m.provider}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </main>
    </div>
  );
}