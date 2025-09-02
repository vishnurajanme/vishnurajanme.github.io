import { motion } from "framer-motion";

export default function Button({ href, variant, children }) {
  // Define styles based on the 'variant' prop
  const styles = {
    primary: "bg-purple-700 text-white border-transparent",
    secondary: "bg-transparent border-2 border-purple-700 text-purple-400",
  };

  const buttonClass = `
    ${styles[variant]}
    font-bold 
    py-3 
    px-6 
    rounded-full 
    text-lg 
    shadow-lg 
    transition-all 
    duration-300
    w-full 
    text-center
  `;

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(142, 45, 226, 0.7)" }}
      whileTap={{ scale: 0.95 }}
      className={buttonClass}
    >
      {children}
    </motion.a>
  );
}