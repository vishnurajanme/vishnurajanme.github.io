import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../src/index.css';

// --- Loading Fallback Component ---
// This component will be shown to users while the page content is loading.
// It matches the website's theme for a seamless experience.
function LoadingFallback() {
  return (
    <div className="bg-gradient-to-br from-black to-purple-950 min-h-screen font-sans text-white flex justify-center items-center">
      <div className="text-center">
        <div className="animate-pulse text-2xl font-semibold tracking-wider text-purple-300">
          Connecting you to Vishnu Rajan!
        </div>
        <div className="w-24 h-1 bg-purple-500 rounded-full mx-auto mt-4 animate-pulse"></div>
      </div>
    </div>
  );
}


// --- Lazy-loaded Page Components ---
// Using React.lazy splits your code into smaller chunks,
// so users only download the code for the page they are visiting.
const App = lazy(() => import('./App.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Training = lazy(() => import('./pages/Training.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));

// --- App Rendering ---
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Suspense shows the LoadingFallback component while lazy components are loading */}
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="training" element={<Training />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);

