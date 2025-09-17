import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import GalaxyBackground from "./GalaxyBackground";

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black z-10">
      <div className="w-[50px] h-[50px] border-[5px] border-white/30 border-t-[#8e2de2] rounded-full animate-spin"></div>
    </div>
  );
};

// ==========================================================
// Helper function: Extract pixel data from an image
// (exact same implementation as original)
// ==========================================================
const getImageData = (image) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height);
};

// ==========================================================
// FUNCTION GROUPS (reorganized from original single-file)
// - setupThree: handles Three.js scene/camera/renderer, loop, events
// - loadImageAndCreateParticles: loads texture and prepares particle geometry/material
// - createParticleGeometry: converts imageData -> BufferGeometry + attribs
// - startParticleAnimationSubscriber: sets up per-frame uniform updates
// - cleanupParticles: removes points & disposes resources
// The content, uniforms, shaders and logic are preserved exactly.
// ==========================================================

// ---------------------- 1. Loading Three.js ----------------------
function setupThree(canvasRef, setThreeObjects, mouseRef) {
  const mount = canvasRef.current;
  if (!mount) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);
  camera.position.z = 2;

  setThreeObjects({ scene, camera });

  const handleResize = () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const handleMouseMove = (e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("mousemove", handleMouseMove);

  return {
    scene,
    camera,
    renderer,
    cleanup: () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj.texture) obj.texture.dispose();
      });
      renderer.dispose();
    },
  };
}

// ---------------------- Utility: calculateImageYOffset ----------------------
function makeCalculateImageYOffset(camera, imageSize) {
  return () => {
    if (!camera) return 0;
    const distance = camera.position.z - 0.1;
    const visibleHeight =
      2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * distance;

    if (window.innerWidth < 640) {
      const topPadding = 0.2;
      return visibleHeight / 2 - imageSize / 2 - topPadding;
    } else {
      return visibleHeight / 8;
    }
  };
}

// ---------------------- 2. Image Loading & 3. Image -> Particles ----------------------
function loadImageAndCreateParticles(scene, camera, mouseRef, onComplete) {
  // This function replicates the original textureLoader.load(...) block
  // It produces the Points (geometry + material) and adds it to the scene.
  const imageSize = 1.5;
  const calculateImageYOffset = makeCalculateImageYOffset(camera, imageSize);

  const imagePointsRef = { current: null };

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/profile.png", (texture) => {
    // --- This code block runs only once the texture is loaded ---
    const imageData = getImageData(texture.image);
    const imgWidth = imageData.width;
    const imgHeight = imageData.height;
    const blockSize = 8;
    const gridWidth = Math.floor(imgWidth / blockSize);
    const gridHeight = Math.floor(imgHeight / blockSize);
    const imgParticleCount = gridWidth * gridHeight;
    const imgGeometry = new THREE.BufferGeometry();
    const imgPositions = new Float32Array(imgParticleCount * 3);
    const imgColors = new Float32Array(imgParticleCount * 3);
    const imgOriginalPositions = new Float32Array(imgParticleCount * 3);
    const imgSizes = new Float32Array(imgParticleCount);
    const imgRandomOffsets = new Float32Array(imgParticleCount * 3);
    const imgAnimationDelays = new Float32Array(imgParticleCount);
    let idx = 0;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        let pixelCount = 0;
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const pixelX = x * blockSize + bx;
            const pixelY = y * blockSize + by;
            const i = (pixelY * imgWidth + pixelX) * 4;
            r += imageData.data[i];
            g += imageData.data[i + 1];
            b += imageData.data[i + 2];
            a += imageData.data[i + 3];
            pixelCount++;
          }
        }
        r /= pixelCount;
        g /= pixelCount;
        b /= pixelCount;
        a /= pixelCount;
        if (a / 255 > 0.1) {
          const mappedX =
            (x / gridWidth - 0.5) * imageSize * (imgWidth / imgHeight);
          const mappedY = -(y / gridHeight - 0.5) * imageSize;
          imgOriginalPositions[idx * 3 + 0] = mappedX;
          imgOriginalPositions[idx * 3 + 1] = mappedY;
          imgOriginalPositions[idx * 3 + 2] = 0.1;
          imgPositions[idx * 3 + 0] =
            mappedX + (Math.random() - 0.5) * imageSize * 16.0;
          imgPositions[idx * 3 + 1] =
            mappedY + (Math.random() - 0.5) * imageSize * 3.0;
          imgPositions[idx * 3 + 2] = (Math.random() - 0.5) * imageSize * 16.0;
          imgRandomOffsets[idx * 3 + 0] = (Math.random() - 0.5) * 3.0;
          imgRandomOffsets[idx * 3 + 1] = (Math.random() - 0.5) * 3.0;
          imgRandomOffsets[idx * 3 + 2] = (Math.random() - 0.2) * 8.0;
          imgColors[idx * 3 + 0] = r / 255;
          imgColors[idx * 3 + 1] = g / 255;
          imgColors[idx * 3 + 2] = b / 255;
          imgSizes[idx] = Math.random() * 8 + 15;
          imgAnimationDelays[idx] = Math.random() * 0.7;
          idx++;
        }
      }
    }
    imgGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(imgPositions.slice(0, idx * 3), 3)
    );
    imgGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(imgColors.slice(0, idx * 3), 3)
    );
    imgGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(imgSizes.slice(0, idx), 1)
    );
    imgGeometry.setAttribute(
      "originalPosition",
      new THREE.BufferAttribute(imgOriginalPositions.slice(0, idx * 3), 3)
    );
    imgGeometry.setAttribute(
      "randomOffset",
      new THREE.BufferAttribute(imgRandomOffsets.slice(0, idx * 3), 3)
    );
    imgGeometry.setAttribute(
      "animationDelay",
      new THREE.BufferAttribute(imgAnimationDelays.slice(0, idx), 1)
    );

    // ======================================================
    // 4. ANIMATION 1: Fly back to center
    // 5. ANIMATION 2: Color reveal
    // 6. ANIMATION 3: Mouse interaction
    // (All shader code preserved exactly; comments mark sections)
    // ======================================================
    const imgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_animation_progress: { value: 0 },
        u_base_scale: { value: 1.0 },
        u_y_offset: { value: calculateImageYOffset() },
        u_start_color: { value: new THREE.Color(0x8e2de2) },
        cameraaspect: { value: camera.aspect },
      },
      vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute vec3 originalPosition;
          attribute vec3 randomOffset;
          attribute float animationDelay;
          uniform float u_time;
          uniform vec2 u_mouse;
          uniform float u_animation_progress;
          uniform float u_base_scale;
          uniform float u_y_offset;
          uniform float cameraaspect;
          varying vec3 vColor;
          varying float vAnimationDelay;
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          float snoise(vec2 v) {
              const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
              vec2 i  = floor(v + dot(v, C.yy) );
              vec2 x0 = v -   i + dot(i, C.xx);
              vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod289(i);
              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
              m = m*m; m = m*m;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5);
              vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
              vec3 g;
              g.x  = a0.x  * x0.x  + h.x  * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
          }
          void main() {
            vColor = color;
            vAnimationDelay = animationDelay;
            float delayedProgress = clamp(u_animation_progress - animationDelay * 0.5, 0.0, 1.0);
            float c1 = 1.70158;
            float c3 = c1 + 1.0;
            float easedProgress = 1.0 + c3 * pow(delayedProgress - 1.0, 3.0) + c1 * pow(delayedProgress - 1.0, 2.0);
            float assemblyProgress = delayedProgress;
            vec3 targetPosition = originalPosition;
            targetPosition.y += u_y_offset;
            vec3 initialScatteredPosition = targetPosition + randomOffset;
            vec3 currentPosition = mix(initialScatteredPosition, targetPosition, easedProgress);
            float noiseFactor = (1.0 - assemblyProgress) * 0.15;
            float noiseSpeed = u_time * 0.3;
            currentPosition.x += snoise(vec2(originalPosition.x * 0.5, noiseSpeed)) * noiseFactor;
            currentPosition.y += snoise(vec2(originalPosition.y * 0.5, noiseSpeed)) * noiseFactor;
            currentPosition.z += snoise(vec2(originalPosition.z * 0.5, noiseSpeed)) * noiseFactor * 2.0;
            float finalStateFactor = smoothstep(1.9, 2.0, u_animation_progress);
            if (finalStateFactor > 0.0) {
              vec2 mouseWorldPos = vec2(
                  (u_mouse.x - 0.5) * cameraaspect,
                  (u_mouse.y - 0.5)
              );
              float cameraDist = 2.0;
              float fov = 75.0;
              float fovRadians = fov * (3.14159 / 180.0);
              float visibleHeight = 2.0 * tan(fovRadians / 2.0) * cameraDist;
              float visibleWidth = visibleHeight * cameraaspect;
              mouseWorldPos.x *= visibleWidth;
              mouseWorldPos.y *= visibleHeight;
              float distToMouse = distance(currentPosition.xy, mouseWorldPos);
              float bulgeRadius = 0.8;
              float bulgeStrength = smoothstep(bulgeRadius, 0.0, distToMouse) * 0.03;
              currentPosition.z += bulgeStrength;
              vec2 dir = normalize(currentPosition.xy - mouseWorldPos);
              currentPosition.xy += dir * bulgeStrength * 0.1;
              currentPosition = mix(targetPosition, currentPosition, finalStateFactor);
            }
            vec4 mvPosition = modelViewMatrix * vec4(currentPosition, 1.0);
            float sizeMultiplier = mix(2.0, 1.0, easedProgress);
            gl_PointSize = size * sizeMultiplier * (u_base_scale / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
      fragmentShader: ` 
          varying vec3 vColor; 
          varying float vAnimationDelay; 
          uniform float u_animation_progress; 
          uniform vec3 u_start_color; 
          void main() { 
            float assemblyProgress = clamp(u_animation_progress, 0.0, 1.0); 
            float colorRevealPhaseProgress = clamp(u_animation_progress - 1.0, 0.0, 1.0); 
            float particleColorProgress = smoothstep(vAnimationDelay, vAnimationDelay + 0.5, colorRevealPhaseProgress); 
            vec3 finalColor = mix(u_start_color, vColor, particleColorProgress); 
            float d = length(gl_PointCoord - 0.5); 
            float opacity = smoothstep(0.5, 0.2, d); 
            gl_FragColor = vec4(finalColor, opacity * assemblyProgress); 
          }`,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const points = new THREE.Points(imgGeometry, imgMaterial);
    points.renderOrder = 1;
    if (onComplete) {
      onComplete(points);
    }
  });
}

// ---------------------- Main ThreeCanvas Component ----------------------
export default function ThreeCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true); // <-- THE FIX: Add this line

  const [threeObjects, setThreeObjects] = useState({
    scene: null,
    camera: null,
  });

  // Keep a ref to particle controller so we can clean up
  const threeCleanupRef = useRef(null);
  const imagePointsRef = useRef(null);
  const animationStartTimeRef = useRef(null);
  const animationSubscribersRef = useRef(new Map()); // <-- ADD THIS

  const subscribeToAnimation = React.useCallback((key, callback) => {
    animationSubscribersRef.current.set(key, callback);
  }, []); // Empty dependency array because the ref itself is stable

  const unsubscribeFromAnimation = React.useCallback((key) => {
    animationSubscribersRef.current.delete(key);
  }, []);

  useEffect(() => {
    let isMounted = true; // 1. ADD a flag to track if the component is active.
    const mount = canvasRef.current;
    if (!mount) return;

    // 1. Setup three
    const three = setupThree(canvasRef, setThreeObjects, mouse);
    if (!three) return;

    const clock = new THREE.Clock();

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const totalElapsedTime = clock.getElapsedTime();

      // This is the new animation logic, encapsulated here
      if (imagePointsRef.current && animationStartTimeRef.current !== null) {
        const points = imagePointsRef.current;
        const calculateImageYOffset = makeCalculateImageYOffset(
          three.camera,
          1.5
        );

        const animationTime = totalElapsedTime - animationStartTimeRef.current;

        points.material.uniforms.u_time.value = animationTime;
        points.material.uniforms.u_animation_progress.value = Math.min(
          2.0,
          animationTime / 1.8
        );

        points.material.uniforms.u_mouse.value.set(
          mouse.current.x / window.innerWidth,
          1.0 - mouse.current.y / window.innerHeight
        );
        points.material.uniforms.u_y_offset.value = calculateImageYOffset();
        points.material.uniforms.cameraaspect.value = three.camera.aspect;
      }

      animationSubscribersRef.current.forEach((callback) =>
        callback(totalElapsedTime)
      );

      three.renderer.render(three.scene, three.camera);
    };
    animate(); // Start the loop

    const onParticlesCreated = (points) => {
      if (isMounted) {
        console.log("Particle object received by ThreeCanvas:", points); // <--- ADD THIS LINE
        three.scene.add(points); // 4. ADD the points to the scene here.
        imagePointsRef.current = points;
        animationStartTimeRef.current = clock.getElapsedTime();
        setIsLoading(false);
      }
    };
    threeCleanupRef.current = three.cleanup;

    // 2–3–4–5–6: load texture, create particles, shaders, and start animation
    loadImageAndCreateParticles(
      three.scene,
      three.camera,
      mouse,
      onParticlesCreated
    );

    // Save objects in state for rendering child components (GalaxyBackground & ParticleImage wrapper)
    setThreeObjects({ scene: three.scene, camera: three.camera });

    return () => {
      isMounted = false; // 2. SET the flag to false on cleanup.
      cancelAnimationFrame(frameId); // Stop the animation loop

      // Dispose of particles from the ref
      if (imagePointsRef.current) {
        // We can safely remove the points from the scene before full disposal
        if (three.scene) three.scene.remove(imagePointsRef.current);
        imagePointsRef.current.geometry.dispose();
        imagePointsRef.current.material.dispose();
        imagePointsRef.current = null;
      }

      // The original cleanup for three.js
      if (threeCleanupRef.current) {
        threeCleanupRef.current();
      }
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div
        ref={canvasRef}
        className={`absolute inset-0 z-0 bg-black transition-opacity duration-[1500ms] ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {threeObjects.scene && !isLoading && (
          <>
            <GalaxyBackground
              scene={threeObjects.scene}
              mouse={mouse}
              subscribe={subscribeToAnimation}
              unsubscribe={unsubscribeFromAnimation}
            />
          </>
        )}
      </div>
    </>
  );
}
