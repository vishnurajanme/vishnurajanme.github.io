import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Helper function to get pixel data from an image
const getImageData = (image) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height);
};

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    let scene, camera, renderer, backgroundPoints, imagePoints, clock;
    let frameId;
    let imageLoaded = false;
    const imageSize = 1.5;

    const calculateImageYOffset = () => {
        const distance = camera.position.z - 0.1;
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * distance;
        
        if (window.innerWidth < 640) { // Tailwind 'sm' breakpoint
            const topPadding = 0.2; 
            return (visibleHeight / 2) - (imageSize / 2) - topPadding;
        } else {
            return visibleHeight / 8;
        }
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antalias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
      camera.position.z = 2;
      clock = new THREE.Clock();

      // Background Particles logic...
      const particleCount = 20000;
      const bgGeometry = new THREE.BufferGeometry();
      const bgPositions = new Float32Array(particleCount * 3);
      const bgSizes = new Float32Array(particleCount);
      const bgColors = new Float32Array(particleCount * 3);
      const color1 = new THREE.Color(0x4a00e0);
      const color2 = new THREE.Color(0x8e2de2);
      for (let i = 0; i < particleCount; i++) {
        bgPositions[i * 3 + 0] = (Math.random() - 0.5) * 20;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        bgSizes[i] = Math.random() * 20;
        const mixedColor = color1.clone().lerp(color2, Math.random());
        bgColors[i * 3 + 0] = mixedColor.r; bgColors[i * 3 + 1] = mixedColor.g; bgColors[i * 3 + 2] = mixedColor.b;
      }
      bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
      bgGeometry.setAttribute("size", new THREE.BufferAttribute(bgSizes, 1));
      bgGeometry.setAttribute("color", new THREE.BufferAttribute(bgColors, 3));
      const bgMaterial = new THREE.ShaderMaterial({
        uniforms: { u_time: { value: 0 }, u_mouse: { value: new THREE.Vector2(0, 0) }, u_base_scale: { value: 1.5 } },
        vertexShader: ` attribute float size; attribute vec3 color; uniform float u_time; uniform vec2 u_mouse; uniform float u_base_scale; varying vec3 vColor; void main() { vColor = color; vec3 newPosition = position; vec2 screenPos = ((projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0)).xy / (projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0)).w) * 0.5 + 0.5; float distToMouse = distance(screenPos, u_mouse); float ripple = sin(distToMouse * 15.0 - u_time * 2.0) * 0.05; newPosition.z += ripple; newPosition.x += sin(newPosition.y * 0.5 + u_time * 0.1) * 0.1; newPosition.y += cos(newPosition.x * 0.5 + u_time * 0.1) * 0.1; vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0); gl_PointSize = size * (u_base_scale / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
        fragmentShader: ` varying vec3 vColor; void main() { float d = length(gl_PointCoord - 0.5); float opacity = smoothstep(0.5, 0.2, d); gl_FragColor = vec4(vColor, opacity); }`,
        transparent: true, depthWrite: false,
      });
      backgroundPoints = new THREE.Points(bgGeometry, bgMaterial);
      scene.add(backgroundPoints);

      // Image Particles logic...
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/profile.png', (texture) => {
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
            let r = 0, g = 0, b = 0, a = 0;
            let pixelCount = 0;
            for (let by = 0; by < blockSize; by++) {
              for (let bx = 0; bx < blockSize; bx++) {
                const pixelX = x * blockSize + bx;
                const pixelY = y * blockSize + by;
                const i = (pixelY * imgWidth + pixelX) * 4;
                r += imageData.data[i]; g += imageData.data[i + 1]; b += imageData.data[i + 2]; a += imageData.data[i + 3];
                pixelCount++;
              }
            }
            r /= pixelCount; g /= pixelCount; b /= pixelCount; a /= pixelCount;
            if (a / 255 > 0.1) {
              const mappedX = (x / gridWidth - 0.5) * imageSize * (imgWidth / imgHeight);
              const mappedY = -(y / gridHeight - 0.5) * imageSize;
              imgOriginalPositions[idx * 3 + 0] = mappedX; imgOriginalPositions[idx * 3 + 1] = mappedY; imgOriginalPositions[idx * 3 + 2] = 0.1;
              imgPositions[idx * 3 + 0] = mappedX + (Math.random() - 0.5) * imageSize * 16.0;
              imgPositions[idx * 3 + 1] = mappedY + (Math.random() - 0.5) * imageSize * 3.0;
              imgPositions[idx * 3 + 2] = (Math.random() - 0.5) * imageSize * 16.0;
              imgRandomOffsets[idx * 3 + 0] = (Math.random() - 0.5) * 0.8; imgRandomOffsets[idx * 3 + 1] = (Math.random() - 0.5) * 0.8; imgRandomOffsets[idx * 3 + 2] = (Math.random() - 0.5) * 0.8;
              imgColors[idx * 3 + 0] = r / 255; imgColors[idx * 3 + 1] = g / 255; imgColors[idx * 3 + 2] = b / 255;
              imgSizes[idx] = Math.random() * 8 + 15;
              imgAnimationDelays[idx] = Math.random() * 0.7;
              idx++;
            }
          }
        }
        imgGeometry.setAttribute("position", new THREE.BufferAttribute(imgPositions.slice(0, idx * 3), 3));
        imgGeometry.setAttribute("color", new THREE.BufferAttribute(imgColors.slice(0, idx * 3), 3));
        imgGeometry.setAttribute("size", new THREE.BufferAttribute(imgSizes.slice(0, idx), 1));
        imgGeometry.setAttribute("originalPosition", new THREE.BufferAttribute(imgOriginalPositions.slice(0, idx * 3), 3));
        imgGeometry.setAttribute("randomOffset", new THREE.BufferAttribute(imgRandomOffsets.slice(0, idx * 3), 3));
        imgGeometry.setAttribute("animationDelay", new THREE.BufferAttribute(imgAnimationDelays.slice(0, idx), 1));
        const imgMaterial = new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0 }, u_mouse: { value: new THREE.Vector2(0, 0) }, u_animation_progress: { value: 0 }, u_base_scale: { value: 1.0 },
            u_y_offset: { value: calculateImageYOffset() },
            u_start_color: { value: new THREE.Color(0x8e2de2) },
          },
          vertexShader: ` attribute float size; attribute vec3 color; attribute vec3 originalPosition; attribute vec3 randomOffset; attribute float animationDelay; uniform float u_time; uniform vec2 u_mouse; uniform float u_animation_progress; uniform float u_base_scale; uniform float u_y_offset; varying vec3 vColor; varying float vAnimationDelay; void main() { vColor = color; vAnimationDelay = animationDelay; float assemblyProgress = clamp(u_animation_progress, 0.0, 1.0); vec3 targetPosition = originalPosition; targetPosition.y += u_y_offset; vec3 initialScatteredPosition = targetPosition + randomOffset * 2.5; vec3 currentPosition = mix(initialScatteredPosition, targetPosition, assemblyProgress); float animationFactor = 1.0 - assemblyProgress; vec2 screenPos = ((projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.0)).xy / (projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.0)).w) * 0.5 + 0.5; float distToMouse = distance(screenPos, u_mouse); float ripple = sin(distToMouse * 10.0 - u_time * 2.0) * 0.1 * animationFactor; currentPosition.z += ripple; currentPosition.x += sin(currentPosition.y * 1.0 + u_time * 0.5) * 0.05 * animationFactor; currentPosition.y += cos(currentPosition.x * 1.0 + u_time * 0.5) * 0.05 * animationFactor; vec4 mvPosition = modelViewMatrix * vec4(currentPosition, 1.0); gl_PointSize = size * (u_base_scale / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
          fragmentShader: ` varying vec3 vColor; varying float vAnimationDelay; uniform float u_animation_progress; uniform vec3 u_start_color; void main() { float assemblyProgress = clamp(u_animation_progress, 0.0, 1.0); float colorRevealPhaseProgress = clamp(u_animation_progress - 1.0, 0.0, 1.0); float particleColorProgress = smoothstep(vAnimationDelay, vAnimationDelay + 0.5, colorRevealPhaseProgress); vec3 finalColor = mix(u_start_color, vColor, particleColorProgress); float d = length(gl_PointCoord - 0.5); float opacity = smoothstep(0.5, 0.2, d); gl_FragColor = vec4(finalColor, opacity * assemblyProgress); }`,
          transparent: true, depthTest: false, depthWrite: false,
        });
        imagePoints = new THREE.Points(imgGeometry, imgMaterial);
        scene.add(imagePoints);
        imageLoaded = true;
      });
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      if (backgroundPoints) {
        backgroundPoints.material.uniforms.u_time.value = elapsedTime;
        backgroundPoints.material.uniforms.u_mouse.value.set( mouse.current.x / window.innerWidth, 1.0 - mouse.current.y / window.innerHeight );
      }
      if (imagePoints && imageLoaded) {
        imagePoints.material.uniforms.u_time.value = elapsedTime;
        imagePoints.material.uniforms.u_mouse.value.set( mouse.current.x / window.innerWidth, 1.0 - mouse.current.y / window.innerHeight );
        imagePoints.material.uniforms.u_animation_progress.value = Math.min(2.0, elapsedTime / 2.5);
      }
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (imagePoints) {
        imagePoints.material.uniforms.u_y_offset.value = calculateImageYOffset();
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
      if (mount && renderer.domElement) { mount.removeChild(renderer.domElement); }
      if (scene) scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose()); else obj.material.dispose(); } if (obj.texture) obj.texture.dispose(); });
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 z-0"></div>;
}