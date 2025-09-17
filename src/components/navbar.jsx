import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" }, // ✅ Added back
  { to: "/services", label: "Services" },
  { to: "/training", label: "Training" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, staggerChildren: 0.05 },
    },
  };

  const navLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-white/10 to-black/60 backdrop-blur-md border-b border-purple-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-3 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-bold text-lg md:text-xl tracking-tight text-slate-100 hover:text-purple-300 transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            Vishnu Rajan
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-purple-700 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
                end={n.to === "/"}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="md:hidden bg-gradient-to-b from-white/10 to-black/80 backdrop-blur-md border-t border-purple-900/50"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {nav.map((n) => (
                <motion.div key={n.to} variants={navLinkVariants}>
                  <NavLink
                    to={n.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? "bg-purple-700 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                    end={n.to === "/"}
                  >
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
