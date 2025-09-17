import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component listens for route changes and smoothly scrolls the window to the top.
export default function ScrollToTop() {
  // Extracts the pathname from the current location.
  const { pathname } = useLocation();

  // useEffect hook that runs every time the pathname changes.
  useEffect(() => {
    // --- Custom animated scroll function ---
    const smoothScrollToTop = () => {
      const startY = window.scrollY;
      const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
      
      const duration = 800; // Animation duration in milliseconds

      // --- Easing function for an elastic effect (easeOutQuint) ---
      const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

      const scroll = () => {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const elapsedTime = currentTime - startTime;
        
        // If the animation is not finished
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const easedProgress = easeOutQuint(progress);
          window.scrollTo(0, startY * (1 - easedProgress));
          requestAnimationFrame(scroll);
        } else {
          // Ensure it ends exactly at the top
          window.scrollTo(0, 0);
        }
      };

      // Start the animation
      requestAnimationFrame(scroll);
    };

    smoothScrollToTop();
    
  }, [pathname]); // The effect depends on the pathname, so it re-runs on navigation.

  // This component does not render any visible UI elements.
  return null;
}

