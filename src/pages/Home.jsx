import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../App.css";
import Button from "../components/ui/button"; // Adjust the import path as needed

export default function App() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Professor.", "Developer.", "Consultant."];

  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let charIndex = 0;
    const currentRole = roles[roleIndex];
    let typingTimer;
    let backspaceTimer;

    const typeWriter = () => {
      if (charIndex < currentRole.length) {
        setDisplayedText(currentRole.substring(0, charIndex + 1));
        charIndex++;
        typingTimer = setTimeout(typeWriter, 70);
      } else {
        setIsTyping(false);
        backspaceTimer = setTimeout(backspace, 2000);
      }
    };

    const backspace = () => {
      if (charIndex > 0) {
        setDisplayedText(currentRole.substring(0, charIndex - 1));
        charIndex--;
        backspaceTimer = setTimeout(backspace, 50);
      } else {
        setIsTyping(true);
        setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }
    };

    typeWriter();

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(backspaceTimer);
    };
  }, [roleIndex]);

  useEffect(() => {
    // This effect is for the three.js background and does not need changes.
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const mount = canvasRef.current;
      if (!mount || !window.THREE) return;

      let scene, camera, renderer, points, clock;
      let frameId;

      const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        camera.position.z = 2;
        clock = new THREE.Clock();

        const particleCount = 20000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x4a00e0);
        const color2 = new THREE.Color(0x8e2de2);

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
          sizes[i] = Math.random() * 20;
          const mixedColor = color1.clone().lerp(color2, Math.random());
          colors[i * 3 + 0] = mixedColor.r;
          colors[i * 3 + 1] = mixedColor.g;
          colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0 },
            u_mouse: { value: new THREE.Vector2(0, 0) },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          },
          vertexShader: `
            attribute float size; attribute vec3 color; uniform float u_time;
            uniform vec2 u_mouse; varying vec3 vColor;
            void main() {
              vColor = color; vec3 newPosition = position;
              float distToMouse = distance(vec2(newPosition.x, newPosition.y), u_mouse * 10.0);
              float ripple = sin(distToMouse * 2.0 - u_time * 2.0) * 0.5;
              newPosition.z += ripple;
              vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
              gl_PointSize = size * (1.0 / -mvPosition.z) * 1.5;
              gl_Position = projectionMatrix * mvPosition;
            }`,
          fragmentShader: `
            uniform vec2 u_resolution; varying vec3 vColor;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float opacity = smoothstep(0.5, 0.2, d);
              gl_FragColor = vec4(vColor, opacity);
            }`,
          transparent: true,
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);
      };

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (points) {
          points.material.uniforms.u_time.value = clock.getElapsedTime();
          points.material.uniforms.u_mouse.value = new THREE.Vector2(
            mouse.current.x / window.innerWidth,
            1.0 - mouse.current.y / window.innerHeight
          );
        }
        renderer.render(scene, camera);
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (points) {
          points.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        }
      };

      const handleMouseMove = (e) => {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      };

      init();
      animate();
      window.addEventListener("resize", handleResize);
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        if (mount && renderer.domElement) {
          mount.removeChild(renderer.domElement);
        }
      };
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup the script tag if the component unmounts
      const threeScript = document.querySelector(`script[src*="three.min.js"]`);
      if (threeScript) {
        document.head.removeChild(threeScript);
      }
    }
  }, []);

  return (
    // CHANGED: Replaced min-h-screen with h-screen to enforce strict viewport height
    <div className="bg-black text-white font-mono overflow-hidden h-screen flex flex-col items-center justify-center relative p-4 sm:p-6">
      <div ref={canvasRef} className="absolute inset-0 z-0"></div>
      
      {/* CHANGED: Reduced the overall vertical gap for a more compact layout */}
      <div className="flex flex-col items-center text-center relative z-10 w-full gap-y-6">
        
        {/* Image Container */}
        {/* CHANGED: Constrained image height to prevent it from becoming too tall */}
        <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm max-h-[70vh]">
          <motion.img
            src="/profile.png"
            alt="Profile photo"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full object-contain mx-auto"
          />
        </div>

        {/* Name and Typewriter Container */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col sm:flex-row justify-center items-center relative" >
            {/* CHANGED: Replaced inline style with responsive text classes for better control */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none glitch"
            >
              VISHNU
            </motion.h1>
                                  <div style={{ marginLeft: "30px" }}></div> {/* Spacer */}

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none glitch"
            >
              RAJAN
            </motion.h1>
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-2 text-lg md:text-2xl text-gray-400 font-mono"
          >
            <span className="text-purple-400">~/</span>
            <span className="cursor-blink">{displayedText}</span>
            {isTyping && <span className="typing-cursor">_</span>}
          </motion.h2>
        </div>

        {/* Button Container */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full max-w-xs sm:max-w-sm">
            <Button href="/about" variant="primary">
            Know More
            </Button>
            <Button href="/contact" variant="secondary">
            Contact Me
            </Button>
        </div>
      </div>
    </div>
  );
}