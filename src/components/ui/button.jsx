import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // 1. Import 'Link' from react-router-dom

// 2. Create a motion-compatible version of the Link component
const MotionLink = motion(Link);

// 3. Change the function to accept a 'to' prop instead of 'href'
export default function Button({ to, variant, children }) {
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
    inline-block
  `;

  return (
    // 4. Use the new 'MotionLink' component and pass the 'to' prop to it
    <MotionLink
      to={to}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(142, 45, 226, 0.7)" }}
      whileTap={{ scale: 0.95 }}
      className={buttonClass}
    >
      {children}
    </MotionLink>
  );
}