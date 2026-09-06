"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function ThreeDPaper({ className }: { className?: string }) {
  return (
    <div className={`relative w-full h-[420px] md:h-[500px] overflow-hidden select-none cursor-grab active:cursor-grabbing ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[6, 6, 6]} intensity={1.8} />
        <directionalLight position={[-6, -6, -2]} intensity={0.6} color="#e0e8ff" />
        <pointLight position={[0, 0, 5]} intensity={1.0} />
        <PaperCard />
      </Canvas>
    </div>
  );
}

function PaperCard() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragPrevious = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  // Procedural 5:4 Swiss Typography Poster (Helvetica 1957 specimen)
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    // Exact 5:4 aspect ratio
    canvas.width = 2000;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Clean white paper background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle outer glass frame outline
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.fillStyle = "#000000";

    // --- Header (Helvetica | 1957) ---
    ctx.font = "bold 175px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Helvetica", 75, 230);

    ctx.textAlign = "right";
    ctx.fillText("1957", 1925, 230);

    // --- Divider Line 1 ---
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(75, 285);
    ctx.lineTo(1925, 285);
    ctx.stroke();

    // --- Specimen Alphabet & Foundry info ---
    ctx.font = "500 38px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("abcdefghijklmnopqrstuvwxyz 0123456789", 75, 350);
    ctx.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 75, 410);

    ctx.textAlign = "right";
    ctx.fillText("Designer: Max Miedinger", 1925, 350);
    ctx.fillText("Haas Type Foundry", 1925, 410);

    // --- Divider Line 2 ---
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(75, 465);
    ctx.lineTo(1925, 465);
    ctx.stroke();

    // --- Lower Section: Light / Regular / Bold ---
    ctx.textAlign = "left";
    ctx.font = "300 170px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillText("Light", 75, 690);

    ctx.font = "400 170px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillText("Regular", 75, 940);

    ctx.font = "bold 170px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillText("Bold", 75, 1190);

    // --- Giant "Aa" Glyph on Right ---
    ctx.textAlign = "right";
    ctx.font = "bold 820px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillText("Aa", 1925, 1200);

    // --- Bottom Label [minimalism] ---
    ctx.textAlign = "center";
    ctx.font = "500 46px 'Helvetica Neue', Helvetica, Arial, monospace";
    ctx.fillText("[minimalism]", 1000, 1490);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    tex.generateMipmaps = true;
    return tex;
  }, []);

  // ThreeUI custom physical paper wave & glass sheen shader
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uHover;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // ThreeUI undulating wave & edge curl physics
          float waveX = sin(pos.x * 1.1 + uTime * 1.4) * 0.14 * (1.0 + uHover * 0.4);
          float waveY = cos(pos.y * 1.3 + pos.x * 0.4 + uTime * 0.9) * 0.09;
          float cornerCurl = pow(max(0.0, (pos.x + 1.5) * 0.25 + (pos.y + 1.2) * 0.25), 2.2) * 0.08;

          pos.z += waveX + waveY + cornerCurl;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPosition = -mvPosition.xyz;
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uHover;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Specular glass & acetate reflection sheen
          float NdotV = max(0.0, dot(normal, viewDir));
          float fresnel = pow(1.0 - NdotV, 3.2);

          // Ambient & directional illumination gradient
          vec3 lightDir = normalize(vec3(0.6, 0.8, 1.0));
          float diff = max(0.0, dot(normal, lightDir)) * 0.2 + 0.85;

          vec3 specularColor = vec3(1.0, 1.0, 1.0);
          vec3 specular = specularColor * fresnel * (0.35 + uHover * 0.2);

          vec3 finalColor = texColor.rgb * diff + specular;

          // Subtle translucency at the very edges
          float edgeX = smoothstep(0.0, 0.012, min(vUv.x, 1.0 - vUv.x));
          float edgeY = smoothstep(0.0, 0.012, min(vUv.y, 1.0 - vUv.y));
          float alpha = min(edgeX, edgeY) * 0.96 + 0.04;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, [texture]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current = { x, y };

      if (isDragging.current) {
        const deltaX = e.clientX - dragPrevious.current.x;
        const deltaY = e.clientY - dragPrevious.current.y;
        dragRotation.current.y += deltaX * 0.007;
        dragRotation.current.x += deltaY * 0.007;
        dragPrevious.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragPrevious.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth pointer parallax
    pointerCurrent.current.x = THREE.MathUtils.lerp(pointerCurrent.current.x, pointerTarget.current.x, 0.06);
    pointerCurrent.current.y = THREE.MathUtils.lerp(pointerCurrent.current.y, pointerTarget.current.y, 0.06);

    // Settling inertia
    dragRotation.current.x = THREE.MathUtils.lerp(dragRotation.current.x, 0, 0.04);
    dragRotation.current.y = THREE.MathUtils.lerp(dragRotation.current.y, 0, 0.04);

    meshRef.current.rotation.x = pointerCurrent.current.y * 0.28 + dragRotation.current.x;
    meshRef.current.rotation.y = pointerCurrent.current.x * 0.38 + dragRotation.current.y;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.03;

    // Gentle vertical floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.08;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // 5:4 aspect ratio dimensions
  const cardWidth = Math.min(4.4, viewport.width * 0.85);
  const cardHeight = cardWidth * 0.8; // 5:4 aspect ratio

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => {
        if (materialRef.current) materialRef.current.uniforms.uHover.value = 1.0;
      }}
      onPointerOut={() => {
        if (materialRef.current) materialRef.current.uniforms.uHover.value = 0;
      }}
    >
      <planeGeometry args={[cardWidth, cardHeight, 64, 64]} />
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </mesh>
  );
}
