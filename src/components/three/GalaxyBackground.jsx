import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GalaxyBackground({ scene, mouse, subscribe, unsubscribe }) {
  const backgroundPointsRef = useRef();

  useEffect(() => {
    if (!scene) return;

    const particleCount = 20000;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(particleCount * 3);
    const bgSizes = new Float32Array(particleCount);
    const bgColors = new Float32Array(particleCount * 3);
    const isFlyer = new Float32Array(particleCount);
    const flyOutDelay = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x4a00e0);
    const color2 = new THREE.Color(0x8e2de2);
    
    const tunnelLength = 60;
    const innerRadius = 1.5;
    const outerRadius = 10;

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 2) * (outerRadius - innerRadius) + innerRadius;
        
        bgPositions[i * 3 + 0] = Math.cos(angle) * radius * 1.2; 
        bgPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.7; 
        bgPositions[i * 3 + 2] = (Math.pow(Math.random(), 0.5) - 0.4) * tunnelLength;

        bgSizes[i] = Math.random() * 20 + 5;
        const mixedColor = color1.clone().lerp(color2, Math.random());
        bgColors[i * 3 + 0] = mixedColor.r; bgColors[i * 3 + 1] = mixedColor.g; bgColors[i * 3 + 2] = mixedColor.b;

        isFlyer[i] = 0.0;
        flyOutDelay[i] = 0.0;
    }

    // --- MODIFIED: Logic to ensure flyers originate from the outer rim ---
    const flyersCount = 60;
    const flyerIndices = new Set();
    while (flyerIndices.size < flyersCount) {
        flyerIndices.add(Math.floor(Math.random() * particleCount));
    }

    flyerIndices.forEach(index => {
        // Force this particle's position to be on the outer edge
        const angle = Math.random() * Math.PI * 2;
        const minOuterRadius = innerRadius + (outerRadius - innerRadius) * 0.6; // Outer 40%
        const radius = Math.random() * (outerRadius - minOuterRadius) + minOuterRadius;

        bgPositions[index * 3 + 0] = Math.cos(angle) * radius * 1.2;
        bgPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.7;

        isFlyer[index] = 1.0;
        flyOutDelay[index] = Math.random() * 5.0;
    });


    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute("size", new THREE.BufferAttribute(bgSizes, 1));
    bgGeometry.setAttribute("color", new THREE.BufferAttribute(bgColors, 3));
    bgGeometry.setAttribute("isFlyer", new THREE.BufferAttribute(isFlyer, 1));
    bgGeometry.setAttribute("flyOutDelay", new THREE.BufferAttribute(flyOutDelay, 1));
    
    const bgMaterial = new THREE.ShaderMaterial({
        uniforms: { u_time: { value: 0 }, u_mouse: { value: new THREE.Vector2(0, 0) }, u_base_scale: { value: 1.5 } },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            attribute float isFlyer;
            attribute float flyOutDelay;

            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_base_scale;

            varying vec3 vColor;
            varying float vViewZ;
            varying float vSize;
            varying float vFlyOutProgress;

            void main() {
              vColor = color;
              vSize = size;
              vec3 newPosition = position;

              vFlyOutProgress = 0.0;
              float flyOutCycleDuration = 5.0;
              float flyOutAnimDuration = 3.0;
              float cycleTime = mod(u_time + flyOutDelay, flyOutCycleDuration);

              if (isFlyer > 0.5 && cycleTime < flyOutAnimDuration) {
                float progress = cycleTime / flyOutAnimDuration;
                vFlyOutProgress = progress;
                float easedProgress = sin(progress * 1.5707); 
                newPosition.z += easedProgress * 30.0; 
              }

              vec2 centeredMouse = u_mouse - vec2(0.5);
              float parallaxFactor = (position.z) * 0.07;
              newPosition.x += -centeredMouse.x * parallaxFactor;
              newPosition.y += centeredMouse.y * parallaxFactor;
              
              // --- MODIFIED: Increased u_time multiplier to speed up animation ---
              float speedFactor = u_time * 0.4;
              newPosition.x += sin(newPosition.y * 0.5 + speedFactor) * 0.3;
              newPosition.y += cos(newPosition.x * 0.5 + speedFactor) * 0.3;
              newPosition.z += sin(newPosition.x * 0.5 + speedFactor) * 0.2;

              vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
              vViewZ = mvPosition.z; 

              float sizeMultiplier = 1.0 + pow(vFlyOutProgress, 2.0) * 2500.0;
              gl_PointSize = size * sizeMultiplier * (u_base_scale / -mvPosition.z);
              
              gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: ` 
            varying vec3 vColor; 
            varying float vViewZ;
            varying float vSize;
            varying float vFlyOutProgress;

            void main() { 
                float focusPoint = -1.9;
                float focusRange = 6.0;
                
                float depthBlur = smoothstep(0.0, focusRange, abs(vViewZ - focusPoint));
                float normalizedSize = (vSize - 5.0) / 20.0; 
                float sizeBlur = pow(normalizedSize, 2.0) * 1.2;

                float totalBlur = clamp(depthBlur + sizeBlur, 0.0, 1.0);
                totalBlur = max(totalBlur, vFlyOutProgress);

                float d = length(gl_PointCoord - 0.5); 
                float sharpness = 0.4;
                float edge1 = sharpness - (totalBlur * sharpness);

                float baseOpacity = smoothstep(0.5, edge1, d); 
                float flyOutFade = 1.0 - pow(vFlyOutProgress, 4.0);
                
                gl_FragColor = vec4(vColor, baseOpacity * flyOutFade); 
            }
        `,
        transparent: true, depthWrite: false,
    });
    const points = new THREE.Points(bgGeometry, bgMaterial);
    backgroundPointsRef.current = points;
    scene.add(points);

    return () => {
      if (scene && points) {
        scene.remove(points);
        bgGeometry.dispose();
        bgMaterial.dispose();
      }
    };
  }, [scene]);
  
  useEffect(() => {
    // Don't do anything if the functions haven't been passed down yet
    if (!subscribe || !unsubscribe) return;

    const animate = (elapsedTime) => {
        if (backgroundPointsRef.current) {
            backgroundPointsRef.current.material.uniforms.u_time.value = elapsedTime;
            backgroundPointsRef.current.material.uniforms.u_mouse.value.set(mouse.current.x / window.innerWidth, 1.0 - mouse.current.y / window.innerHeight);
        }
    };

    const key = 'galaxyBackground';
    subscribe(key, animate);

    // The cleanup function will automatically unsubscribe
    return () => {
        unsubscribe(key);
    }
}, [subscribe, unsubscribe, mouse]); // Add dependencies

  return null;
}

