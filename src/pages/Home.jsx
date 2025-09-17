import React from 'react';
// Update the import path
import ThreeCanvas from '../components/three/ThreeCanvas.jsx';
import HeroText from '../components/HeroText.jsx';
import CallToActionButtons from '../components/CallToActionButtons.jsx';
import "../App.css";

export default function Home() {
  return (
    <div className="bg-black text-white font-mono overflow-hidden h-screen flex flex-col items-center relative p-4 sm:p-6">
      {/* The new canvas component that handles both particle effects */}
      <ThreeCanvas />

      {/* The rest of the page remains the same */}
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="w-full h-1/2 sm:h-3/4"></div>
        <div className="w-full h-1/2 sm:h-1/4 flex flex-col items-center justify-center gap-y-6">
          <HeroText />
          <CallToActionButtons />
        </div>
      </div>
    </div>
  );
}